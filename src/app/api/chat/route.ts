import { NextRequest, NextResponse } from "next/server";

import {
  appendToConversation,
  getChatsCollection,
  getDbClient,
  getLatestKnowledgeUpdatedAt,
} from "@/lib/mongo";

import { chatSchema } from "@/schema/chat";

import {
  buildSystemPrompt,
  buildUserPrompt,
  findRelevantContent,
  formatKnowledgeUpdatedAt,
  generateChatTitle,
  groq,
  prepareHistoryForAI,
} from "@/lib/chat";

export async function POST(req: NextRequest) {
  const client = await getDbClient();
  const session = client.startSession();
  const chatsCollection = await getChatsCollection();

  try {
    // Parse and validate incoming request
    const { error, data } = await chatSchema.safeParseAsync(await req.json());
    if (error) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 },
      );
    }

    const { message, chatId } = data;

    const existingChat = await chatsCollection.findOne({ chatId });

    // Save user message immediately
    await appendToConversation(chatId, message, null, "user", session);

    // Generate title in background if it's a new chat
    if (!existingChat?.title) {
      generateChatTitle(message).then(async (title) => {
        try {
          await chatsCollection.updateOne({ chatId }, { $set: { title } });
        } catch (e) {
          console.error("Failed to update chat title in DB:", e);
        }
      });
    }

    // Prepare history, Mem0 context, and knowledge freshness
    const chatHistory = prepareHistoryForAI(existingChat);
    const [relevantContent, knowledgeUpdatedAt] = await Promise.all([
      findRelevantContent(message),
      getLatestKnowledgeUpdatedAt(),
    ]);
    const systemPrompt = buildSystemPrompt(knowledgeUpdatedAt);
    const knowledgeLabel = knowledgeUpdatedAt
      ? formatKnowledgeUpdatedAt(knowledgeUpdatedAt)
      : null;

    // Fallback if no relevant content found
    if (!relevantContent) {
      const fallbackResponse =
        "I don't have enough information to answer that question. Feel free to ask me something else about my work, or reach out via the contact page.";

      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(fallbackResponse)}\n\n`),
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));

          try {
            await appendToConversation(
              chatId,
              fallbackResponse,
              null,
              "bot",
              session,
            );
          } catch (e) {
            console.error("Failed to append fallback bot response", e);
          }

          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Stream the AI response
    const aiStreamResponse = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...chatHistory,
        {
          role: "user",
          content: buildUserPrompt({
            message,
            relevantContent,
            knowledgeLabel,
          }),
        },
      ],
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let fullBotResponse = "";

        try {
          for await (const chunk of aiStreamResponse) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              fullBotResponse += content;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(content)}\n\n`),
              );
            }
          }
        } catch (streamError) {
          console.error("Stream generation error:", streamError);
          controller.error(streamError);
        } finally {
          try {
            await appendToConversation(
              chatId,
              fullBotResponse,
              null,
              "bot",
              session,
            );
          } catch (e) {
            console.error("Failed to append bot response to chat history", e);
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat error: ", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
