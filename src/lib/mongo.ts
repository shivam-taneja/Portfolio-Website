import { ClientSession, Db, MongoClient, UpdateFilter } from "mongodb";

import { ChatDocument, ConversationMessage } from "@/types/chats.types";
import { CrawlingMetaData } from "@/types/crawl.types";

import { serverEnv } from "./env/server";

type MongoConnection = {
  client: MongoClient;
  db: Db;
};

/**
 * Cache the in-flight connect promise (not just the client).
 * Otherwise concurrent callers can see `client` set while `db` is still null
 * and return null → "Cannot read properties of null (reading 'collection')".
 */
let connectionPromise: Promise<MongoConnection> | null = null;

function getConnection(): Promise<MongoConnection> {
  if (!connectionPromise) {
    connectionPromise = (async () => {
      const client = new MongoClient(serverEnv().MONGODB_URI);
      await client.connect();
      const db = client.db(serverEnv().MONGODB_DB_NAME);
      return { client, db };
    })().catch((error) => {
      // Let the next caller retry after a failed connect.
      connectionPromise = null;
      throw error;
    });
  }

  return connectionPromise;
}

async function connectToDatabase() {
  const { db } = await getConnection();
  return db;
}

async function getDbClient(): Promise<MongoClient> {
  const { client } = await getConnection();
  return client;
}

async function getChatsCollection() {
  const db = await connectToDatabase();
  return db.collection<ChatDocument>(serverEnv().MONGODB_COLLECTION_CHATS);
}

async function getCrawlingMetaDataCollection() {
  const db = await connectToDatabase();
  return db.collection<CrawlingMetaData>(
    serverEnv().MONGODB_COLLECTION_CRAWLING_META,
  );
}

async function getAllCrawlingMeta(): Promise<CrawlingMetaData[]> {
  const collection = await getCrawlingMetaDataCollection();
  return collection.find({}).toArray();
}

async function upsertCrawlingMeta(meta: CrawlingMetaData): Promise<void> {
  const collection = await getCrawlingMetaDataCollection();
  await collection.updateOne(
    { url: meta.url },
    {
      $set: {
        contentHash: meta.contentHash,
        memoryIds: meta.memoryIds,
        lastIngestedAt: meta.lastIngestedAt,
      },
    },
    { upsert: true },
  );
}

async function deleteCrawlingMetaByUrl(url: string): Promise<void> {
  const collection = await getCrawlingMetaDataCollection();
  await collection.deleteOne({ url });
}

async function clearAllCrawlingMeta(): Promise<void> {
  const collection = await getCrawlingMetaDataCollection();
  await collection.deleteMany({});
}

/** Most recent successful page ingest — used for chatbot freshness UI + prompts. */
async function getLatestKnowledgeUpdatedAt(): Promise<Date | null> {
  const collection = await getCrawlingMetaDataCollection();
  const latest = await collection.findOne(
    {},
    { sort: { lastIngestedAt: -1 }, projection: { lastIngestedAt: 1 } },
  );
  if (!latest?.lastIngestedAt) return null;
  return latest.lastIngestedAt instanceof Date
    ? latest.lastIngestedAt
    : new Date(latest.lastIngestedAt);
}

async function appendToConversation(
  sessionId: string,
  message: string,
  title: string | null,
  type: "bot" | "user",
  mongoSession?: ClientSession,
) {
  const chatsCollection = await getChatsCollection();

  const newMessage: ConversationMessage = {
    message,
    type,
    createdAt: new Date().toString(),
  };

  const setOnInsert: Partial<ChatDocument> = {
    createdAt: new Date().toString(),
  };

  if (title !== null) {
    setOnInsert.title = title;
  }

  const update: UpdateFilter<ChatDocument> = {
    $setOnInsert: setOnInsert,
    $push: {
      conversation: newMessage,
    },
  };

  await chatsCollection.updateOne({ chatId: sessionId }, update, {
    upsert: true,
    session: mongoSession,
  });
}

export {
  appendToConversation,
  clearAllCrawlingMeta,
  connectToDatabase,
  deleteCrawlingMetaByUrl,
  getAllCrawlingMeta,
  getChatsCollection,
  getCrawlingMetaDataCollection,
  getDbClient,
  getLatestKnowledgeUpdatedAt,
  upsertCrawlingMeta,
};
