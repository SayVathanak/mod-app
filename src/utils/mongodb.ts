import { MongoClient } from "mongodb";

// Ensure MONGODB_URI is defined or throw a meaningful error
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

const client = new MongoClient(MONGODB_URI);

export async function connectToDatabase() {
    // The isConnected() method is deprecated, use the recommended approach
    try {
        await client.connect();
        const db = client.db();
        return { db, client };
    } catch (error) {
        console.error('Failed to connect to database', error);
        throw error;
    }
}