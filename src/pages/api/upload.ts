import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "@/lib/cloudinary";
import { IncomingForm, type Files, type File as FormidableFile } from "formidable";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Disable the default body parser to handle form data
export const config = {
    api: {
        bodyParser: false,
    },
};

// Toggle this if you want to allow fallback to local upload
const USE_CLOUDINARY = true;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const form = new IncomingForm({ keepExtensions: true, multiples: false });

    form.parse(req, async (err, fields, files: Files) => {
        if (err) {
            console.error("Form parsing error:", err);
            return res.status(500).json({ message: "Form parsing failed" });
        }

        const uploaded = files.file;
        const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        try {
            const fileType = file.mimetype || "";
            const originalFilename = file.originalFilename || "";
            const filepath = file.filepath;

            if (USE_CLOUDINARY) {
                let folder = "mediaverse/others";
                let resource_type: "image" | "video" | "raw" = "raw";

                if (fileType.startsWith("image/")) {
                    folder = "mediaverse/books/covers";
                    resource_type = "image";
                } else if (fileType.startsWith("video/")) {
                    folder = "mediaverse/videos";
                    resource_type = "video";
                } else if (fileType === "application/pdf") {
                    folder = "mediaverse/books/pdf";
                    resource_type = "raw";
                }

                const result = await cloudinary.uploader.upload(filepath, {
                    resource_type,
                    folder,
                    use_filename: true,
                    unique_filename: false,
                    public_id: originalFilename.split(".")[0],
                });

                return res.status(200).json({ url: result.secure_url });
            } else {
                // Fallback: save file to local uploads folder
                const uploadsDir = path.join(process.cwd(), "public/uploads");
                await fs.mkdir(uploadsDir, { recursive: true });

                const ext = path.extname(originalFilename || "upload");
                const newFilename = `${uuidv4()}${ext}`;
                const newPath = path.join(uploadsDir, newFilename);

                await fs.rename(filepath, newPath);

                const publicUrl = `/uploads/${newFilename}`;
                return res.status(200).json({ url: publicUrl });
            }
        } catch (error) {
            console.error("Upload error:", error);
            return res.status(500).json({
                message: "Upload failed",
                error: (error as Error).message,
            });
        }
    });
};

export default handler;