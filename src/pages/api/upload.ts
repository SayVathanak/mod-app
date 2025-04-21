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

            const isPDF = fileType === "application/pdf";
            const folder = isPDF ? "mediaverse/books/pdf" : "mediaverse/books/covers";
            const resource_type = isPDF ? "raw" : "image";

            const result = await cloudinary.uploader.upload(file.filepath, {
                folder,
                resource_type,
                use_filename: true,
                unique_filename: false,
                public_id: file.originalFilename?.split(".")[0],
                flags: "attachment", // ✅ Triggers download behavior
            });

            return res.status(200).json({ url: result.secure_url });
        } catch (error) {
            console.error("Upload error:", error);
            return res.status(500).json({ message: "Upload failed", error });
        }
    });
};

export default handler;