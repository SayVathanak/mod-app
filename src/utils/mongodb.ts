// utils/mongodb.ts
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToDatabase() {
    if (!client.isConnected()) {
        await client.connect();
    }
    const db = client.db();
    return { db, client };
}
