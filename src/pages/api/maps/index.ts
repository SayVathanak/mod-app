import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import MapModel from "@/models/Map";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method === "GET") {
        const maps = await MapModel.find().sort({ createdAt: -1 });
        return res.status(200).json(maps);
    }

    if (req.method === "POST") {
        const { title, description, mapUrl } = req.body;
        const newMap = new MapModel({ title, description, mapUrl });
        await newMap.save();
        return res.status(201).json(newMap);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
