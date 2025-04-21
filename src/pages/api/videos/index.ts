import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Video from "@/models/Video";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method === "GET") {
        const videos = await Video.find().sort({ createdAt: -1 });
        return res.status(200).json(videos);
    }

    if (req.method === "POST") {
        const { title, description, videoUrl, thumbnailUrl } = req.body;
        const newVideo = new Video({ title, description, videoUrl, thumbnailUrl });
        await newVideo.save();
        return res.status(201).json(newVideo);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
