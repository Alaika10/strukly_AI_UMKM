import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {
    createUser,
    findUserByEmail,
    updatePassword,
} from "../models/UserModel.js";

dotenv.config();

// fallback kalau env gagal kebaca
const SECRET = process.env.ACCESS_TOKEN_KEY || "fallback_secret";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields required" });
        }

        const existing = await findUserByEmail(email);
        if (existing) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await createUser(name, email, hashed);

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
            expiresIn: "1d",
        });

        res.json({
            user,
            token,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email & password required" });
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ error: "Wrong password" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
            expiresIn: "1d",
        });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email, new_password } = req.body;

        // validasi
        if (!email || !new_password) {
            return res
                .status(400)
                .json({ error: "Email & new password required" });
        }

        if (new_password.length < 6) {
            return res
                .status(400)
                .json({ error: "Password minimal 6 karakter" });
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const hashed = await bcrypt.hash(new_password, 10);

        await updatePassword(email, hashed);

        res.json({
            message: "Password berhasil diubah",
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};