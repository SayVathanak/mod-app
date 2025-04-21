import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "@/lib/cloudinary";
import { IncomingForm } from "formidable";
import fs from "fs";

export const config = {
    api: {
        bodyParser: false,
    },
};

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
            let folder = "mediaverse/others"; // Default folder
            let resource_type: "image" | "video" | "raw" = "raw"; // Default resource type

            // Handle different file types (image, video, PDF, etc.)
            if (fileType.startsWith("image/")) {
                folder = "mediaverse/books/covers"; // For image files
                resource_type = "image"; // Image files
            } else if (fileType.startsWith("video/")) {
                folder = "mediaverse/videos"; // For video files (Cloudinary will create this folder)
                resource_type = "video"; // Video files
            } else if (fileType === "application/pdf") {
                folder = "mediaverse/books/pdf"; // For PDF files
                resource_type = "raw"; // PDF files treated as raw
            }

            // Upload the file to Cloudinary
            const result = await cloudinary.uploader.upload(file.filepath, {
                resource_type, // specify resource type
                folder, // specify the Cloudinary folder
                use_filename: true,
                unique_filename: false,
                public_id: file.originalFilename?.split(".")[0],
            });

            // Return the URL of the uploaded file
            return res.status(200).json({ url: result.secure_url });
        } catch (error) {
            console.error("Upload error:", error);
            return res.status(500).json({ message: "Upload failed", error });
        }
    });
};

export default handler;