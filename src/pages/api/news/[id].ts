// pages/api/news/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { performance } from 'perf_hooks';

type ErrorResponse = {
    message: string;
    error?: string;
}

type NewsItem = {
    _id: ObjectId | string;
    title: string;
    body: string;
    imageUrl?: string;
    author?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    category?: string;
    readTime?: string;
    [key: string]: any; // For other potential fields
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<NewsItem | ErrorResponse | { message: string; deletedId: string }>
) {
    // Performance tracking
    const startTime = performance.now();

    // Extract ID with simplified logic
    const { id } = req.query;

    // Basic validation
    if (!id || Array.isArray(id)) {
        return res.status(400).json({ message: 'Invalid article ID: must provide a single ID value' });
    }

    let objectId: ObjectId;

    // Validate ObjectId format
    try {
        objectId = new ObjectId(id);
    } catch (error) {
        return res.status(400).json({ message: 'Invalid article ID format' });
    }

    try {
        const { db } = await connectToDatabase();
        const collection = db.collection('news');

        // Handle different HTTP methods
        switch (req.method) {
            case 'GET':
                return await getNewsItem(objectId, collection, res, startTime);

            case 'PUT':
                return await updateNewsItem(objectId, req.body, collection, res, startTime);

            case 'DELETE':
                return await deleteNewsItem(objectId, collection, res, startTime);

            default:
                // Handle unsupported methods
                res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
                return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error handling news article request:', error);

        return res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        });
    }
}

// Separated function for getting a news item
async function getNewsItem(
    objectId: ObjectId,
    collection: any,
    res: NextApiResponse,
    startTime: number
) {
    // Only request the fields we actually need
    const projection = {
        title: 1,
        body: 1,
        imageUrl: 1,
        author: 1,
        createdAt: 1,
        category: 1,
        readTime: 1
    };

    const news = await collection.findOne(
        { _id: objectId },
        { projection }
    );

    if (!news) {
        return res.status(404).json({ message: 'News article not found' });
    }

    // Format the data consistently for JSON serialization
    const formattedNews = {
        ...news,
        _id: news._id.toString(),
        createdAt: news.createdAt ? new Date(news.createdAt).toISOString() : new Date().toISOString()
    };

    // Add performance metrics header in development
    if (process.env.NODE_ENV === 'development') {
        const endTime = performance.now();
        res.setHeader('X-Response-Time', `${(endTime - startTime).toFixed(2)}ms`);
    }

    return res.status(200).json(formattedNews);
}

// Separated function for updating a news item
async function updateNewsItem(
    objectId: ObjectId,
    updateData: any,
    collection: any,
    res: NextApiResponse,
    startTime: number
) {
    // Add updatedAt timestamp
    updateData.updatedAt = new Date();

    // Remove any attempt to update the _id field
    if (updateData._id) {
        delete updateData._id;
    }

    const result = await collection.findOneAndUpdate(
        { _id: objectId },
        { $set: updateData },
        {
            returnDocument: 'after',
            // Only return specific fields
            projection: {
                title: 1,
                body: 1,
                imageUrl: 1,
                author: 1,
                createdAt: 1,
                updatedAt: 1,
                category: 1,
                readTime: 1
            }
        }
    );

    if (!result || !result.value) {
        return res.status(404).json({ message: 'News article not found' });
    }

    const updatedNews = {
        ...result.value,
        _id: result.value._id.toString(),
        createdAt: result.value.createdAt
            ? new Date(result.value.createdAt).toISOString()
            : null,
        updatedAt: result.value.updatedAt
            ? new Date(result.value.updatedAt).toISOString()
            : null
    };

    // Add performance metrics header in development
    if (process.env.NODE_ENV === 'development') {
        const endTime = performance.now();
        res.setHeader('X-Response-Time', `${(endTime - startTime).toFixed(2)}ms`);
    }

    return res.status(200).json(updatedNews);
}

// Separated function for deleting a news item
async function deleteNewsItem(
    objectId: ObjectId,
    collection: any,
    res: NextApiResponse,
    startTime: number
) {
    const result = await collection.findOneAndDelete({ _id: objectId });

    if (!result || !result.value) {
        return res.status(404).json({ message: 'News article not found' });
    }

    // Add performance metrics header in development
    if (process.env.NODE_ENV === 'development') {
        const endTime = performance.now();
        res.setHeader('X-Response-Time', `${(endTime - startTime).toFixed(2)}ms`);
    }

    return res.status(200).json({
        message: 'News article successfully deleted',
        deletedId: objectId.toString()
    });
}