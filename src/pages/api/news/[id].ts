import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import News from "@/models/News";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    const { id } = req.query;

    if (req.method === "GET") {
        try {
            const news = await News.findById(id);
            if (!news) return res.status(404).json({ message: "Not found" });

            return res.status(200).json(news);
        } catch (error) {
            return res.status(500).json({ message: "Failed to fetch news", error });
        }
    }

    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
