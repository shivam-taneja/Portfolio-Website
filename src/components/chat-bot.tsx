"use client";

import React, { useEffect, useRef, useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { analyticsEvents, captureEvent } from "@/lib/analytics";

import { useChatbotHighlight } from "@/provider/chatbot-highlight";
import { useChatBot } from "@/hooks/use-chat-bot";
import { MessageItem } from "@/components/chat-message-item";

import { chatSchema, ChatSchemaT } from "@/schema/chat";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowDownRight,
  Bot,
  Ellipsis,
  Loader2,
  MessageCircle,
  Send,
  X,
} from "lucide-react";

const SUGGESTED_QUESTIONS = [
  "What projects have you worked on?",
  "What are your technical skills?",
  "Tell me about your experience",
  "How can I contact you?",
];

const ChatOpeningSkeleton = () => (
  <div className="space-y-4" aria-busy="true" aria-label="Loading chat">
    <div className="flex items-start gap-3 w-full">
      <div className="h-8 w-8 shrink-0 rounded-full bg-muted animate-pulse" />
      <div className="flex min-w-0 max-w-[80%] flex-col gap-2">
        <div className="rounded-lg bg-muted p-3 dark:bg-zinc-800">
          <div className="h-3.5 w-40 animate-pulse rounded-sm bg-neutral-300 dark:bg-neutral-600" />
        </div>
        <div className="h-3 w-28 animate-pulse rounded-sm bg-neutral-200 dark:bg-neutral-700" />
      </div>
    </div>

    <div className="space-y-3">
      <div className="mb-3 h-3.5 w-24 animate-pulse rounded-sm bg-neutral-300 dark:bg-neutral-600" />
      <div className="space-y-2">
        {SUGGESTED_QUESTIONS.map((_, i) => (
          <div
            key={i}
            className="h-11 w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800"
          />
        ))}
      </div>
    </div>
  </div>
);

const ChatBotContent = () => {
  const [open, setOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { isHighlighted, disableHighlight } = useChatbotHighlight();

  const {
    messages,
    isLoading,
    isPending,
    error,
    chatId,
    chatDocument,
    knowledgeUpdatedAt,
    isKnowledgeFreshnessLoading,
    handleResetChat,
    sendMessageStream,
  } = useChatBot(open);

  const knowledgeUpdatedLabel = knowledgeUpdatedAt
    ? new Date(knowledgeUpdatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const form = useForm<ChatSchemaT>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      chatId: chatId ?? "",
      message: "",
    },
    mode: "all",
  });

  const submitMessage = async (
    message: string,
    source: "typed" | "suggested_question",
  ) => {
    form.reset();
    captureEvent(analyticsEvents.chatbotMessageSent, {
      message_length: message.length,
      source,
    });
    await sendMessageStream(message);
  };

  const onSubmit = async (values: ChatSchemaT) => {
    await submitMessage(values.message, "typed");
  };

  const handleSuggestedQuestion = (question: string) => {
    form.setValue("message", question);
    captureEvent(analyticsEvents.chatbotSuggestedQuestionClicked, {
      question,
    });
    submitMessage(question, "suggested_question");
  };

  const resetChat = () => {
    captureEvent(analyticsEvents.chatbotReset);
    handleResetChat();
  };

  // Scroll to bottom after any new message
  useEffect(() => {
    if (!open) return;

    const timeout = setTimeout(() => {
      const scrollContainer = scrollRef.current?.parentElement?.parentElement;

      scrollContainer?.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [messages, open]);

  // Sync form chatId
  useEffect(() => {
    if (chatId) form.reset({ chatId, message: "" });
  }, [chatId, form]);

  useEffect(() => {
    if (isHighlighted && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isHighlighted]);

  useEffect(() => {
    if (!error) return;

    captureEvent(analyticsEvents.chatbotError, {
      message: error.message,
    });
  }, [error]);

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (value) {
          captureEvent(analyticsEvents.chatbotOpened);
          disableHighlight();
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          aria-label="Open chat assistant"
          aria-expanded={open}
          aria-controls="chat-assistant-panel"
          className={cn(
            "fixed bottom-4 right-4 z-[999] h-12 w-12 rounded-full p-0 dark:hover:bg-black hover:bg-zinc-300 dark:bg-zinc-700 bg-gray-200 dark:text-white text-zinc-900",
            isHighlighted && "ring-4 ring-green-400",
          )}
        >
          {isHighlighted && (
            <ArrowDownRight
              aria-hidden="true"
              size={60}
              className="animate-bounce absolute -left-3 -top-5 text-green-400"
            />
          )}
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        id="chat-assistant-panel"
        role="dialog"
        aria-label="Chat assistant"
        className="mx-4 mb-2 text-sm min-w-96 max-w-96 w-full p-0 dark:bg-black bg-white dark:border-zinc-800 border-zinc-200"
      >
        <div className="flex items-center justify-between border-b dark:border-zinc-800 border-zinc-200 p-4">
          {chatDocument?.chat?.title ? (
            <div className="flex gap-1 items-center">
              <h3 className="font-semibold dark:text-white text-zinc-900">
                {chatDocument?.chat?.title}
              </h3>

              <DropdownMenu>
                <DropdownMenuTrigger aria-label="Chat options">
                  <Ellipsis
                    size={15}
                    className="cursor-pointer dark:text-white text-zinc-900"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={resetChat}
                  >
                    Reset Chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <h3 className="dark:text-white text-zinc-900">Chat Assistant</h3>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="dark:text-white text-zinc-900 dark:hover:bg-zinc-800 hover:bg-zinc-100"
            aria-label="Close chat assistant"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <ScrollArea className="h-[400px] p-4">
          <div
            className="min-w-0 space-y-4"
            ref={scrollRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {error ? (
              <div className="dark:text-white text-zinc-900">
                <p>{error.message}</p>
                <p>
                  Click{" "}
                  <button
                    type="button"
                    className="underline cursor-pointer dark:hover:text-neutral-300 hover:text-zinc-600"
                    onClick={resetChat}
                  >
                    here
                  </button>{" "}
                  to reset
                </p>
              </div>
            ) : isLoading && messages.length === 0 ? (
              <ChatOpeningSkeleton />
            ) : (
              <>
                {messages.map((message, i) => (
                  <MessageItem key={i} message={message} />
                ))}

                {messages.length === 1 && !isPending && (
                  <div className="space-y-3">
                    <p className="text-sm dark:text-gray-400 text-gray-600 mb-3">
                      You can ask me:
                    </p>

                    <div className="space-y-2">
                      {SUGGESTED_QUESTIONS.map((question, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestedQuestion(question)}
                          className="w-full text-left p-3 rounded-lg dark:bg-zinc-800 bg-zinc-100 dark:hover:bg-zinc-700 hover:bg-zinc-200 dark:text-white text-zinc-900 transition-colors text-sm"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isPending && (
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 flex justify-center items-center bg-muted">
                      <Bot
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </Avatar>

                    <div
                      className="rounded-lg px-3 py-2 max-w-[80%] bg-muted"
                      role="status"
                      aria-label="Assistant is typing"
                    >
                      <Loader2 className="animate-spin" aria-hidden="true" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 border-t dark:border-zinc-800 border-zinc-200 flex w-full gap-2"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="sr-only">Message</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Type your message..."
                      className="w-full"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="icon"
              disabled={isPending}
              className="cursor-pointer dark:bg-zinc-800 bg-zinc-900 dark:hover:bg-zinc-700 hover:bg-zinc-800 text-white"
              aria-label="Send message"
            >
              {isPending ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </form>
        </Form>

        <div className="flex justify-center px-4 pb-3">
          <p className="text-center text-xs dark:text-neutral-400 text-neutral-600">
            Note: Responses aren&apos;t always accurate or complete.
            {(isKnowledgeFreshnessLoading || knowledgeUpdatedLabel) && (
              <>
                {" "}
                Knowledge last updated{" "}
                {isKnowledgeFreshnessLoading ? (
                  <span
                    aria-hidden="true"
                    className="inline-block h-3 w-[5.5rem] translate-y-0.5 rounded-sm bg-neutral-300 align-middle dark:bg-neutral-600 animate-pulse"
                  />
                ) : (
                  <time
                    dateTime={knowledgeUpdatedAt ?? undefined}
                    className="font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    {knowledgeUpdatedLabel}
                  </time>
                )}
                .
              </>
            )}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const ChatBot = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ChatBotContent />
    </QueryClientProvider>
  );
};

export default ChatBot;
