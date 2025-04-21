import mongoose from "mongoose";

const MapSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        mapUrl: { type: String }, // Optional image via Cloudinary
    },
    { timestamps: true }
);

export default mongoose.models.Map || mongoose.model("Map", MapSchema);
