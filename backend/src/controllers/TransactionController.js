import {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
} from "../models/TransactionModel.js";

import { mapCategory } from "../utils/categoryMapper.js";
import { getCategoryByName } from "../models/CategoryModel.js";
import { sendToOCR } from "../service/OcrService.js";
import { parseOCRText } from "../utils/ocrParser.js";

// CREATE MANUAL

export const create = async (req, res) => {
    try {
        const data = req.body;

        if (!data.amount) {
            return res.status(400).json({ error: "Amount is required" });
        }

        const categoryId =
            data.category_id ||
            (data.category
                ? (await getCategoryByName(data.category))?.id
                : null) ||
            1;

        const mappedData = {
            user_id: req.user.id,
            category_id: categoryId,
            amount: data.amount,
            merchant: data.merchant || "",
            transaction_date:
                data.transaction_date || new Date().toISOString().split("T")[0],
            source: "manual",
            type: data.type || "expense",
        };

        const result = await createTransaction(mappedData);

        res.json({
            ...result,
            transactionId: result?.id,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CREATE FROM OCR

export const createFromOCR = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "File is required" });
        }

        // Kirim file ke FastAPI OCR dengan nama file asli agar png/jpg/jpeg tetap terdeteksi
        const ocrResult = await sendToOCR(
            req.file.buffer,
            req.file.originalname,
        );

        const rawText = ocrResult.ocr_mentah || "";

        const parsed = parseOCRText(rawText);

        // Mapping kategori dari teks
        const categoryName = mapCategory(rawText);
        const category = await getCategoryByName(categoryName);

        // sementara parsing masih dummy
        const mappedData = {
            user_id: req.user.id,
            category_id: category?.id || 1,
            amount: parsed.amount,
            merchant: parsed.merchant,
            transaction_date: parsed.date,
            source: "auto",
            type: "expense",
        };

        const result = await createTransaction(mappedData);

        res.json({
            ...result,
            transactionId: result?.id,
            raw_text: rawText,
            mapped_category: categoryName,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ALL

export const getAll = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await getTransactions(userId);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE

export const update = async (req, res) => {
    try {
        const transactionId = req.params.id;

        if (!transactionId) {
            return res
                .status(400)
                .json({ error: "Transaction id is required" });
        }

        const data = req.body;

        const categoryId =
            data.category_id ||
            (data.category
                ? (await getCategoryByName(data.category))?.id
                : null);

        const payload = {
            ...data,
            category_id: categoryId || data.category_id,
        };

        const result = await updateTransaction(
            transactionId,
            payload,
            req.user.id,
        );

        if (!result) {
            return res.status(404).json({
                error: "Transaction not found",
            });
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE

export const remove = async (req, res) => {
    try {
        const transactionId = req.params.id;

        if (!transactionId) {
            return res
                .status(400)
                .json({ error: "Transaction id is required" });
        }

        const result = await deleteTransaction(transactionId, req.user.id);

        if (!result) {
            return res.status(404).json({
                error: "Transaction not found",
            });
        }

        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
