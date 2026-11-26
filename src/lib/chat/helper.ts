import { ChatDocument } from "@/types/chats.types";
import { MEM0_USER_ID } from "./constants";
import { groq } from "./groq";
import { memoryClient } from "./mem0";

export async function generateChatTitle(message: string): Promise<string> {
  try {
    const titleRes = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "user",
          content: `Generate a short title (max 5 words) for this message: "${message}". Return only the title.`,
        },
      ],
      max_tokens: 100,
    });

    const title = titleRes.choices[0]?.message?.content?.trim() || "New Chat";
    return title.replace(/^["'](.*)["']$/, "$1"); // trim quotes
  } catch (e) {
    console.error("Title generation fail", e);
    return "New Chat";
  }
}

export async function findRelevantContent(
  message: string,
): Promise<string | null> {
  try {
    const { results } = await memoryClient.search(message, {
      filters: { user_id: MEM0_USER_ID },
    });

    if (!results || results.length === 0) {
      return null;
    }

    // Mem0 returns an array of memory objects with a 'memory' field
    const contextLines = results.map((res) => res.memory).filter(Boolean);
    return contextLines.join("\n");
  } catch (error) {
    console.error("Mem0 search error: ", error);
    return null;
  }
}

export function prepareHistoryForAI(existingChat: ChatDocument | null) {
  const chatHistory: { role: "user" | "assistant"; content: string }[] = [];

  if (existingChat) {
    for (const msg of existingChat.conversation) {
      chatHistory.push({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.message,
      });
    }
  }

  return chatHistory;
}
