# 🤖 Chatbot Documentation

## Overview

The AI chatbot is a core feature of this portfolio website, allowing visitors to interact with an AI representation of me. The chatbot can answer questions about my skills, experience, projects, and more using information from my website content.

## Architecture

The chatbot system consists of several interconnected components:

1. **Frontend Interface**: A chat UI built with React and Tailwind CSS
2. **Chat Backend**: API endpoints handling message processing and response generation
3. **Memory Client**: `mem0ai` for retrieving contextual memory and website content
4. **AI Model**: Groq API (`llama3-8b-8192`) for generating natural language responses

## How It Works

### Chat Initialization

When a user clicks on the chatbot button in the frontend:

1. A request is sent to the `/api/chat/initialize` endpoint
2. A new chat session is created in MongoDB with a unique ID
3. This ID is returned to the frontend and stored in localStorage
4. The chat interface is loaded with any existing conversation history

```typescript
// Simplified chat initialization
export async function initializeChat() {
  const response = await fetch("/api/chat/initialize", {
    method: "POST",
  });

  const { chatId } = await response.json();
  localStorage.setItem("chatId", chatId);
  return chatId;
}
```

### Message Processing

When a user sends a message:

1. The message and chatId are sent to the `/api/chat` endpoint
2. The user's message is immediately stored in MongoDB chat history
3. `mem0ai` searches its knowledge base for relevant context
4. The message, relevant context, and chat history are formatted and sent to Groq AI
5. The AI generates a streaming response, which is streamed to the frontend
6. Once streaming completes, the final response is saved to the chat history

```typescript
// Simplified message processing flow
export async function POST(req: NextRequest) {
  const { message, chatId } = await req.json();

  // Save user message immediately
  await appendToConversation(chatId, message, null, "user", session);

  // Search for relevant content in Mem0
  const relevantContent = await findRelevantContent(message);

  // Get chat history
  const existingChat = await chatsCollection.findOne({ chatId });
  const chatHistory = prepareHistoryForAI(existingChat);

  // Stream AI response using Groq
  const aiStreamResponse = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...chatHistory,
      { role: "user", content: `CONTEXT: ... \nMESSAGE: ${message}` },
    ],
    stream: true,
  });

  // (Streaming logic omitted for brevity...)

  // Return ReadableStream
  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
```

### Response Generation

The Groq AI model generates responses based on:

1. A system prompt specifying it should respond as Shivam Taneja
2. The complete chat history for context
3. Relevant content from the website related to the user's query
4. The user's latest message

The model is configured to:

- Use a lightweight model (llama3-8b-8192) for speed
- Generate concise responses with appropriate tone
- Provide a title for the chat conversation
- Return valid JSON format

## Database Schema

The chatbot utilizes the following collection in MongoDB:

### Chats Collection

```typescript
interface ChatDocument {
  chatId: string; // Unique chat identifier
  title: string; // AI-generated chat title
  conversation: {
    // Array of messages
    type: "user" | "bot";
    message: string;
    timestamp: Date;
  }[];
  createdAt: Date;
}
```

## Content Ingest (Mem0 sync)

Dev-only endpoint: `GET /api/chat/ingest`

It crawls the local sitemap, hashes each page’s extracted text, and syncs Mem0 using MongoDB `crawling_meta` (url, contentHash, memoryIds):

- **Unchanged pages** → skip
- **New / changed pages** → delete prior Mem0 memory IDs for that URL, then `add`, upsert meta
- **Removed pages** (in meta but not sitemap) → delete those memories + meta docs

Wipe only (no ingest):

```bash
# with `pnpm dev` running
curl "http://localhost:3000/api/chat/ingest?reset=1"
```

Ingest / incremental sync (separate step):

```bash
curl "http://localhost:3000/api/chat/ingest"
```

`?reset=1` only wipes Mem0 for `shivam_portfolio` and clears `crawling_meta`. It does **not** re-ingest. Call ingest without `reset` when you want to add content.

## Optimization Techniques

The chatbot implementation uses several techniques to ensure good performance:

1. **Mem0 Knowledge Base**: Context is retrieved efficiently using Mem0's specialized memory layer.
2. **Streaming Responses**: The backend streams the Groq AI response back to the client as Server-Sent Events, drastically reducing perceived latency.
3. **Model Selection**: Using Groq's lightning-fast `openai/gpt-oss-20b` model.

## Configuration

The chatbot requires the following environment variables:

```env
MONGODB_URI=""
MONGODB_DB_NAME=""
MONGODB_COLLECTION_CHATS=""
MONGODB_COLLECTION_CRAWLING_META=""
GROQ_API_KEY=""
MEM0_API_KEY=""
```

## Future Improvements

Planned improvements for the chatbot include:

1. Adding feedback mechanism to improve responses
2. Implementing caching for common questions
3. Adding typing indicators and read receipts
