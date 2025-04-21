import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "@/lib/cloudinary";

export const config = {
    api: {
        bodyParser: false,
    },
};

import { IncomingForm } from "formidable";
import fs from "fs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, async (_, fields, files: any) => {
        const file = files.file?.[0];
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        try {
            const fileType = file.mimetype;

            // Set folder based on file type
            const folder = fileType === "application/pdf"
                ? "mediaverse/books/pdf"
                : "mediaverse/books/covers";

            const resource_type = fileType === "application/pdf" ? "raw" : "image";

            const result = await cloudinary.uploader.upload(file.filepath, {
                folder,
                resource_type,
            });

            return res.status(200).json({ url: result.secure_url });
        } catch (error) {
            console.error("Upload error:", error);
            return res.status(500).json({ message: "Upload failed", error });
        }
    });
};

export default handler;