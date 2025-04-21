import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.News || mongoose.model("News", NewsSchema);
