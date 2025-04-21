import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method === "GET") {
        const books = await Book.find().sort({ createdAt: -1 });
        return res.status(200).json(books);
    }

    if (req.method === "POST") {
        const { title, author, description, coverUrl, pdfUrl } = req.body;
        const newBook = new Book({ title, author, description, coverUrl, pdfUrl });
        await newBook.save();
        return res.status(201).json(newBook);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
