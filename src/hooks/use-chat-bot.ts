import { useEffect, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useChatBotActions, useChatBotId } from "@/store/chatbot-store";
import { ChatDocument, ConversationMessage } from "@/types/chats.types";
import { analyticsEvents, captureEvent } from "@/lib/analytics";

export async function fetchMessages(
  chatId: string,
): Promise<{ chat: ChatDocument }> {
  const response = await fetch(`/api/chat/${chatId}`);

  if (!response.ok) {
    let errMsg = "Failed to fetch messages";
    if (response.status === 404) errMsg += ": Chat not found";
    throw new Error(errMsg);
  }

  return response.json();
}

export async function initializeChat(): Promise<{ chatId: string }> {
  const response = await fetch(`/api/chat/initialize`, { method: "GET" });
  if (!response.ok) throw new Error("Failed to initialize chat");
  return response.json();
}

export async function fetchKnowledgeFreshness(): Promise<{
  updatedAt: string | null;
}> {
  const response = await fetch("/api/chat/knowledge");
  if (!response.ok) throw new Error("Failed to fetch knowledge freshness");
  return response.json();
}

export function useChatBot(open: boolean) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isPending, setIsPending] = useState(false);

  const chatId = useChatBotId();
  const { setChatId, resetChatId } = useChatBotActions();
  const queryClient = useQueryClient();

  const {
    data: chatDocument,
    refetch: refetchChat,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => fetchMessages(chatId!),
    enabled: !!chatId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { data: knowledgeFreshness, isLoading: isKnowledgeFreshnessLoading } =
    useQuery({
      queryKey: ["chatKnowledgeFreshness"],
      queryFn: fetchKnowledgeFreshness,
      enabled: open,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    if (chatDocument?.chat.conversation) {
      setMessages(chatDocument.chat.conversation);
    }
  }, [chatDocument]);

  const { mutateAsync: initChat, isPending: isInitPending } = useMutation({
    mutationFn: () => initializeChat(),
    onSuccess: async (res) => {
      setChatId(res.chatId);
      captureEvent(analyticsEvents.chatbotConversationStarted);
      queryClient.invalidateQueries({ queryKey: ["chatBotUserCtn"] });
      window.dispatchEvent(new Event("chatbot-user-count-updated"));
    },
    onError: (err) => {
      console.error("Failed to initialize chat", err);
    },
  });

  useEffect(() => {
    const init = async () => {
      if (open && !chatId) {
        try {
          await initChat();
        } catch (error) {
          console.error("Initialization failed", error);
        }
      }
    };
    init();
  }, [open, chatId, initChat]);

  const sendMessageStream = async (messageText: string) => {
    const userMessage: ConversationMessage = {
      message: messageText,
      type: "user",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentChatId = chatId ?? "";
    if (!currentChatId) return;

    setIsPending(true);

    try {
      const response = await fetch(`/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, chatId: currentChatId }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response body");

      let botMessageContent = "";
      setMessages((prev) => [
        ...prev,
        {
          message: "",
          type: "bot",
          createdAt: new Date().toISOString(),
        },
      ]);

      setIsPending(false); // stream starts, stop sending spinner

      let currentStreamBuffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        currentStreamBuffer += decoder.decode(value, { stream: true });

        let i;
        while ((i = currentStreamBuffer.indexOf("\n\n")) !== -1) {
          const chunk = currentStreamBuffer.slice(0, i);
          currentStreamBuffer = currentStreamBuffer.slice(i + 2);

          if (chunk.startsWith("data: ")) {
            const dataStr = chunk.slice(6);
            if (dataStr.trim() === "[DONE]") continue;

            try {
              const parsed = JSON.parse(dataStr);
              botMessageContent += parsed;

              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  ...newMessages[newMessages.length - 1],
                  message: botMessageContent,
                };
                return newMessages;
              });
            } catch {}
          }
        }
      }
    } catch (error) {
      console.error(error);

      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];

        if (lastMsg && lastMsg.type === "bot" && lastMsg.message === "") {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].message =
            "Sorry, something went wrong. Please try again.";
          return newMessages;
        }

        return [
          ...prev,
          {
            message: "Sorry, something went wrong. Please try again.",
            type: "bot",
            createdAt: new Date().toISOString(),
          },
        ];
      });
    } finally {
      setIsPending(false);
      if (currentChatId && open) {
        await refetchChat();
      }
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    resetChatId();
  };

  return {
    messages,
    isLoading: isLoading || isInitPending || (open && !chatId),
    isPending,
    error,
    chatId,
    chatDocument,
    knowledgeUpdatedAt: knowledgeFreshness?.updatedAt ?? null,
    isKnowledgeFreshnessLoading,
    handleResetChat,
    sendMessageStream,
  };
}
