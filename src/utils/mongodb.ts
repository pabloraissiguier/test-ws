import { Message } from "@/server";
import { MongoClient } from "mongodb";

// Connection URI for MongoDB Atlas
const uri =
  "mongodb+srv://pablo:PPNyp21EM6zjHlik@nextchatcluster.1fqlfvd.mongodb.net/?retryWrites=true&w=majority";

// Create a new MongoClient
const client = new MongoClient(uri);

export async function getMessages(): Promise<Message[]> {
  try {
    // Connect to the MongoDB Atlas cluster
    await client.connect();

    // Access the database and collection
    const db = client.db("trpc-chat");
    const collection = db.collection<Message>("messages");

    // Get documents from the collection
    const documents = await collection.find().toArray();

    return documents;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  } finally {
    // Close the connection
    await client.close();
  }
}

export async function storeMessage(message: Message) {
  try {
    // Connect to the MongoDB Atlas cluster
    await client.connect();

    // Access the database and collection
    const db = client.db("trpc-chat");
    const collection = db.collection("messages");

    // Insert a document into the collection
    const result = await collection.insertOne(message);

    return result.insertedId;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the connection
    await client.close();
  }
}
