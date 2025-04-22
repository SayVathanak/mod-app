// import type { NextApiRequest, NextApiResponse } from "next";
// import dbConnect from "@/lib/mongodb";
// import News from "@/models/News";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     await dbConnect();

//     const { id } = req.query;

//     if (req.method === "GET") {
//         try {
//             const news = await News.findById(id);
//             if (!news) return res.status(404).json({ message: "News item not found" });

//             return res.status(200).json(news);
//         } catch (error) {
//             return res.status(500).json({ message: "Failed to fetch news", error });
//         }
//     }

//     if (req.method === "PUT") {
//         try {
//             const updatedNews = await News.findByIdAndUpdate(
//                 id,
//                 req.body,
//                 { new: true, runValidators: true }
//             );

//             if (!updatedNews) return res.status(404).json({ message: "News item not found" });

//             return res.status(200).json(updatedNews);
//         } catch (error) {
//             return res.status(400).json({ message: "Failed to update news", error });
//         }
//     }

//     if (req.method === "DELETE") {
//         try {
//             const deletedNews = await News.findByIdAndDelete(id);

//             if (!deletedNews) return res.status(404).json({ message: "News item not found" });

//             return res.status(200).json({ message: "News item successfully deleted" });
//         } catch (error) {
//             return res.status(500).json({ message: "Failed to delete news", error });
//         }
//     }

//     res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
// }

// pages/api/news/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;

    try {
        const { db } = await connectToDatabase();

        // Convert string ID to ObjectId
        const objectId = new ObjectId(id as string);

        const news = await db.collection('news').findOne({ _id: objectId });

        if (!news) {
            return res.status(404).json({ message: 'News article not found' });
        }

        // Format the data to ensure it's JSON serializable
        const formattedNews = {
            ...news,
            _id: news._id.toString(),
            createdAt: news.createdAt ? new Date(news.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
        };

        return res.status(200).json(formattedNews);
    } catch (error) {
        console.error('Error fetching news item:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}