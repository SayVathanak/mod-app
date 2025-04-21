import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        author: { type: String, required: true },
        description: { type: String, required: true },
        coverUrl: { type: String },
        pdfUrl: String,
    },
    { timestamps: true }
);

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
