import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        videoUrl: { type: String }, // Cloudinary URL
    },
    { timestamps: true }
);

export default mongoose.models.Video || mongoose.model("Video", VideoSchema);
