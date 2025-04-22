// lib/mongodb.ts
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

// OPTION 1: Mongoose Connection (for schema-based approach)
// ========================================================

// Extend the global object for caching the connection
interface MongooseGlobal {
    mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseGlobal['mongoose'];
}

// Initialize global cache
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect(): Promise<typeof mongoose> {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const options = {
            bufferCommands: false,
        };
        
        cached.promise = mongoose.connect(MONGODB_URI, options);
    }

    try {
        cached.conn = await cached.promise;
        console.log('Mongoose connected successfully');
        return cached.conn;
    } catch (error) {
        console.error('Mongoose connection error:', error);
        throw error;
    }
}

// OPTION 2: MongoDB Native Driver Connection (for direct access)
// =============================================================

// Global cache for MongoDB client
interface MongoClientGlobal {
    mongoClient: {
        client: MongoClient | null;
        clientPromise: Promise<MongoClient> | null;
        isConnecting: boolean;
    };
}

declare global {
    // eslint-disable-next-line no-var
    var mongoClient: MongoClientGlobal['mongoClient'];
}

// Initialize global MongoDB client cache
if (!global.mongoClient) {
    global.mongoClient = { 
        client: null, 
        clientPromise: null,
        isConnecting: false
    };
}

// Function to connect to MongoDB using the native driver
export async function connectToDatabase() {
    // If we already have a connected client, use it
    if (global.mongoClient.client) {
        return {
            db: global.mongoClient.client.db(),
            client: global.mongoClient.client
        };
    }

    // If we're in the process of connecting, wait for the existing promise
    if (global.mongoClient.isConnecting && global.mongoClient.clientPromise) {
        try {
            const client = await global.mongoClient.clientPromise;
            return {
                db: client.db(),
                client
            };
        } catch (error) {
            console.error('Failed to connect to database:', error);
            // Reset the connection state so we can retry
            global.mongoClient.isConnecting = false;
            global.mongoClient.clientPromise = null;
            throw error;
        }
    }

    // Otherwise, create a new connection
    try {
        global.mongoClient.isConnecting = true;
        const client = new MongoClient(MONGODB_URI);
        global.mongoClient.clientPromise = client.connect();
        
        // Wait for connection
        const connectedClient = await global.mongoClient.clientPromise;
        global.mongoClient.client = connectedClient;
        global.mongoClient.isConnecting = false;
        
        console.log('MongoDB native client connected successfully');
        return {
            db: connectedClient.db(),
            client: connectedClient
        };
    } catch (error) {
        console.error('Failed to connect to database:', error);
        global.mongoClient.isConnecting = false;
        global.mongoClient.clientPromise = null;
        throw error;
    }
}

// Export mongoose connection as default for backward compatibility
export default dbConnect;