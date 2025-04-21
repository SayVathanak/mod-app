// pages/api/auth/register.ts
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ error: "Missing fields" });
        }

        try {
            const { db } = await connectToDatabase();

            // Check if email already exists
            const existingUser = await db.collection("users").findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: "Email already exists" });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the new user into the database
            const newUser = await db.collection("users").insertOne({
                email,
                username,
                password: hashedPassword,
            });

            return res.status(200).json({ success: true, message: "User registered successfully" });
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
