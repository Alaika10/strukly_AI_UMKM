import {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
} from "../models/TransactionModel.js";

import { mapCategory } from "../utils/categoryMapper.js";
import { getCategoryByName } from "../models/CategoryModel.js";

export const create = async (req, res) => {
    try {
        const data = req.body;

        const mappedData = {
            user_id: req.user.id, // dari token
            category_id: data.category_id,
            amount: data.amount,
            merchant: data.merchant,
            transaction_date: data.transaction_date,
            source: "manual",
            type: data.type,
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

export const createFromOCR = async (req, res) => {
    try {
        const data = req.body;

        const categoryName = mapCategory(data.category || data.merchant);
        const category = await getCategoryByName(categoryName);

        const mappedData = {
            user_id: req.user.id, // dari token
            category_id: category?.id || 1, // fallback
            amount: data.amount,
            merchant: data.merchant,
            transaction_date:
                data.date ||
                data.transaction_date ||
                new Date().toISOString().split("T")[0],
            source: "auto",
            type: data.type || "expense",
        };

        const result = await createTransaction(mappedData);

        res.json({
            ...result,
            transactionId: result?.id,
            mapped_category: categoryName,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const parseTransactionId = (req) => {
    const rawId =
        req.params?.id ||
        req.body?.id ||
        req.body?.transactionId ||
        req.query?.id ||
        req.query?.transactionId ||
        req.headers["transaction-id"] ||
        req.headers["x-transaction-id"];

    if (typeof rawId === "number") {
        return rawId > 0 ? rawId : null;
    }

    if (typeof rawId === "string") {
        if (rawId.trim() === "" || rawId.includes("{{")) {
            return null;
        }

        const parsed = parseInt(rawId, 10);
        return Number.isNaN(parsed) || parsed <= 0 ? null : parsed;
    }

    return null;
};

export const getAll = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await getTransactions(userId);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const update = async (req, res) => {
    try {
        const transactionId = parseTransactionId(req);
        if (!transactionId) {
            return res.status(400).json({
                error: "Invalid transaction id. Use route param, query param, or request body id.",
            });
        }

        const result = await updateTransaction(
            transactionId,
            req.body,
            req.user.id,
        );

        if (!result) {
            return res.status(404).json({
                error: "Transaction not found or no fields to update",
            });
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const remove = async (req, res) => {
    try {
        const transactionId = parseTransactionId(req);
        if (!transactionId) {
            return res.status(400).json({
                error: "Invalid transaction id. Use route param, query param, or request body id.",
            });
        }

        const result = await deleteTransaction(transactionId, req.user.id);

        if (!result) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
