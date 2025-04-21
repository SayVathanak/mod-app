import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import News from "@/models/News";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method === "GET") {
        const news = await News.find({});
        return res.status(200).json(news);
    }

    if (req.method === "POST") {
        try {
            const news = new News(req.body);
            await news.save();
            return res.status(201).json(news);
        } catch (error) {
            return res.status(400).json({ message: "Failed to create news", error });
        }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
