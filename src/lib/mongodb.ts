// lib/mongodb.ts
import mongoose from 'mongoose';
import { MongoClient, MongoClientOptions } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || '';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

// Connection configuration
const CONNECTION_OPTIONS: MongoClientOptions = {
    connectTimeoutMS: 10000, // 10 seconds
    socketTimeoutMS: 45000,  // 45 seconds
    maxPoolSize: 20,        // Maximum connection pool size
    minPoolSize: 5,         // Minimum connection pool size
};

// OPTION 1: Mongoose Connection (for schema-based approach)
// ========================================================

interface MongooseGlobal {
    mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
        lastConnectionTime: number | null;
        isConnected: boolean;
    };
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseGlobal['mongoose'];
}

// Initialize global cache with additional tracking properties
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null,
        lastConnectionTime: null,
        isConnected: false
    };
}

export async function dbConnect(): Promise<typeof mongoose> {
    const currentTime = Date.now();

    // If we have a cached connection less than 30 minutes old and it's connected
    if (
        cached.conn &&
        cached.lastConnectionTime &&
        currentTime - cached.lastConnectionTime < 30 * 60 * 1000 &&
        cached.isConnected
    ) {
        // Ping the database to ensure the connection is still alive
        try {
            if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
                await mongoose.connection.db.admin().ping();
                return cached.conn;
            } else {
                console.log('Connection state not ready, reconnecting...');
            }
        } catch (e) {
            console.log('Connection stale, reconnecting...');
            // Connection is stale, we'll reconnect below
        }
    }

    // If no connection exists or the connection is stale
    if (!cached.promise || !cached.isConnected) {
        const options = {
            bufferCommands: false,
            connectTimeoutMS: CONNECTION_OPTIONS.connectTimeoutMS,
            socketTimeoutMS: CONNECTION_OPTIONS.socketTimeoutMS,
        };

        cached.promise = mongoose.connect(MONGODB_URI, options);
    }

    try {
        cached.conn = await cached.promise;
        cached.isConnected = mongoose.connection.readyState === 1; // 1 = connected
        cached.lastConnectionTime = Date.now();

        // Add connection event listeners
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            cached.isConnected = false;
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            cached.isConnected = false;
        });

        return cached.conn;
    } catch (error) {
        cached.isConnected = false;
        console.error('Mongoose connection error:', error);
        throw error;
    }
}

// OPTION 2: MongoDB Native Driver Connection (for direct access)
// =============================================================

interface MongoClientGlobal {
    mongoClient: {
        client: MongoClient | null;
        clientPromise: Promise<MongoClient> | null;
        isConnecting: boolean;
        lastPingTime: number | null;
        connectionStatus: 'connected' | 'disconnected' | 'connecting';
    };
}

declare global {
    // eslint-disable-next-line no-var
    var mongoClient: MongoClientGlobal['mongoClient'];
}

// Initialize global MongoDB client cache with enhanced tracking
if (!global.mongoClient) {
    global.mongoClient = {
        client: null,
        clientPromise: null,
        isConnecting: false,
        lastPingTime: null,
        connectionStatus: 'disconnected'
    };
}

// Function to connect to MongoDB using the native driver
export async function connectToDatabase() {
    const currentTime = Date.now();

    // Check if existing connection is valid
    if (global.mongoClient.client &&
        global.mongoClient.lastPingTime &&
        currentTime - global.mongoClient.lastPingTime < 30 * 60 * 1000 &&
        global.mongoClient.connectionStatus === 'connected') {

        try {
            // Verify connection with ping
            await global.mongoClient.client.db().admin().ping();
            global.mongoClient.lastPingTime = currentTime;
            return {
                db: global.mongoClient.client.db(MONGODB_DB),
                client: global.mongoClient.client
            };
        } catch (e) {
            console.log('MongoDB native client connection stale, reconnecting...');
            // Connection stale, will reconnect below
            global.mongoClient.connectionStatus = 'disconnected';
            try {
                // Close the stale connection
                await global.mongoClient.client?.close();
            } catch (err) {
                // Ignore close errors
            }
            global.mongoClient.client = null;
        }
    }

    // If we're in the process of connecting, wait for the existing promise
    if (global.mongoClient.isConnecting && global.mongoClient.clientPromise) {
        try {
            global.mongoClient.connectionStatus = 'connecting';
            const client = await global.mongoClient.clientPromise;
            global.mongoClient.connectionStatus = 'connected';
            global.mongoClient.lastPingTime = currentTime;

            return {
                db: client.db(MONGODB_DB),
                client
            };
        } catch (error) {
            console.error('Failed to connect to database:', error);
            // Reset the connection state so we can retry
            global.mongoClient.isConnecting = false;
            global.mongoClient.clientPromise = null;
            global.mongoClient.connectionStatus = 'disconnected';
            throw error;
        }
    }

    // Create a new connection with enhanced error handling and timeout
    try {
        global.mongoClient.isConnecting = true;
        global.mongoClient.connectionStatus = 'connecting';

        const client = new MongoClient(MONGODB_URI, CONNECTION_OPTIONS);

        // Add performance monitoring
        const connectionStartTime = Date.now();

        global.mongoClient.clientPromise = client.connect()
            .then(client => {
                const connectionTime = Date.now() - connectionStartTime;
                console.log(`MongoDB connection established in ${connectionTime}ms`);
                return client;
            });

        // Wait for connection
        const connectedClient = await global.mongoClient.clientPromise;

        global.mongoClient.client = connectedClient;
        global.mongoClient.isConnecting = false;
        global.mongoClient.connectionStatus = 'connected';
        global.mongoClient.lastPingTime = currentTime;

        // Set up automatic reconnection
        connectedClient.on('close', () => {
            console.log('MongoDB connection closed');
            global.mongoClient.connectionStatus = 'disconnected';
        });

        connectedClient.on('error', (err) => {
            console.error('MongoDB client error:', err);
            global.mongoClient.connectionStatus = 'disconnected';
        });

        return {
            db: connectedClient.db(MONGODB_DB),
            client: connectedClient
        };
    } catch (error) {
        console.error('Failed to connect to database:', error);
        global.mongoClient.isConnecting = false;
        global.mongoClient.clientPromise = null;
        global.mongoClient.connectionStatus = 'disconnected';
        throw error;
    }
}

// Export mongoose connection as default for backward compatibility
export default dbConnect;