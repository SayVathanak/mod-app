// pages/api/news/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Handle both /api/news/[id] and /_next/data/[buildID]/news/[id].json
    let id: string;
    
    if (req.url?.includes('/_next/data/')) {
        // Extract ID from Next.js data route format
        const parts = req.url.split('/');
        id = parts[parts.length - 1].replace('.json', '');
    } else {
        // Standard API route parameter
        id = req.query.id as string;
    }

    // Check if id is provided and is a valid string
    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid article ID' });
    }

    // Rest of your existing handler code remains the same...
    try {
        const { db } = await connectToDatabase();

        // Add debug logging
        console.log(`Processing request for news article with ID: ${id}`);

        // Validate and convert ID to ObjectId
        let objectId;
        try {
            objectId = new ObjectId(id);
        } catch (error) {
            console.error('Invalid ObjectId format:', error);
            return res.status(400).json({ message: 'Invalid article ID format' });
        }

        // Handle GET method - Fetch article
        if (req.method === 'GET') {
            console.log(`Attempting to find news article with _id: ${objectId}`);

            const news = await db.collection('news').findOne({ _id: objectId });

            console.log('Database query result:', news);

            if (!news) {
                return res.status(404).json({ message: 'News article not found' });
            }

            // Format the data to ensure it's JSON serializable
            const formattedNews = {
                ...news,
                _id: news._id.toString(),
                createdAt: news.createdAt
                    ? new Date(news.createdAt).toISOString()
                    : new Date().toISOString()
            };

            return res.status(200).json(formattedNews);
        }

        // Handle PUT method - Update article
        else if (req.method === 'PUT') {
            const updateData = req.body;

            // Add updatedAt timestamp
            updateData.updatedAt = new Date();

            console.log(`Updating news article with ID: ${id}`, updateData);

            // Fixed findOneAndUpdate for TypeScript compatibility
            const result = await db.collection('news').findOneAndUpdate(
                { _id: objectId },
                { $set: updateData },
                { returnDocument: 'after' }
            );

            // Handle null result
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

            return res.status(200).json(updatedNews);
        }

        // Handle DELETE method
        else if (req.method === 'DELETE') {
            console.log(`Deleting news article with ID: ${id}`);

            // Fixed findOneAndDelete for TypeScript compatibility
            const result = await db.collection('news').findOneAndDelete({ _id: objectId });

            // Handle null result
            if (!result || !result.value) {
                return res.status(404).json({ message: 'News article not found' });
            }

            return res.status(200).json({
                message: 'News article successfully deleted',
                deletedId: id
            });
        }

        // Handle unsupported methods
        else {
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
        }
    } catch (error: unknown) {
        // Type-safe error handling
        console.error('Error handling news article request:', error);

        // Safe error message extraction
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        });
    }
}