// /pages/api/books.ts

import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method === "GET") {
        try {
            const books = await Book.find().sort({ createdAt: -1 });
            return res.status(200).json(books);
        } catch (error) {
            return res.status(500).json({ message: "Failed to fetch books", error });
        }
    }

    if (req.method === "POST") {
        try {
            const { title, author, description, coverUrl, pdfUrl } = req.body;

            const newBook = new Book({
                title,
                author,
                description,
                coverUrl,
                pdfUrl, // ✅ Now saving the PDF URL
            });

            await newBook.save();
            return res.status(201).json(newBook);
        } catch (error) {
            return res.status(500).json({ message: "Failed to create book", error });
        }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
