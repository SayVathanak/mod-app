import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        videoUrl: { type: String },
        thumbnailUrl: { type: String }, // 👈 New
    },
    { timestamps: true }
);

export default mongoose.models.Video || mongoose.model("Video", VideoSchema);
