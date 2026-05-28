import {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
} from "../models/TransactionModel.js";

import { mapCategory } from "../utils/categoryMapper.js";
import { getCategoryByName } from "../models/CategoryModel.js";
import { sendToOCR } from "../service/OcrService.js";
import { parseOCRText, parseItemsFromOCR } from "../utils/ocrParser.js";
import { createNotification } from "../models/NotificationModel.js";


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

        // Add Notification
        const notifType = result.type === "income" ? "income" : "expense";
        const notifMsg = result.type === "income" ? `Pemasukan baru tercatat: Rp ${Number(result.amount).toLocaleString()}` : `Pengeluaran baru tercatat: Rp ${Number(result.amount).toLocaleString()}`;
        await createNotification(req.user.id, notifType, notifMsg);

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

        // 1. Kirim file ke FastAPI OCR (endpoint: https://sicheater99-ocr-trial.hf.space/scan-ocr/)
        const ocrResult = await sendToOCR(
            req.file.buffer,
            req.file.originalname,
        );
        console.log("res ocr :", ocrResult)

        if (!ocrResult || ocrResult.sukses === false) {
            return res.status(400).json({ error: ocrResult?.pesan || "Gagal memproses gambar" });
        }

        // Defensive parsing in case ocrResult is a JSON-encoded string
        let ocrData = ocrResult;
        if (typeof ocrData === "string" && ocrData.trim().startsWith("{")) {
            try {
                ocrData = JSON.parse(ocrData);
            } catch {
                // Ignore parsing error
            }
        }

        // If the pipeline output is stored as a string inside 'classes' or 'category'
        let aiPipelineResult = {};
        const fieldsToCheck = [ocrData.classes, ocrData.category, ocrData.pipeline_output, ocrData.result];
        for (const field of fieldsToCheck) {
            if (typeof field === "string" && field.trim().startsWith("{")) {
                try {
                    aiPipelineResult = JSON.parse(field);
                    break;
                } catch {
                    // Ignore parsing error
                }
            }
        }

        // Merge properties if nested pipeline result was successfully parsed
        const finalOcr = {
            ...ocrData,
            ...aiPipelineResult
        };

        // Extract raw_text
        const rawText = finalOcr.raw_text || finalOcr.ocr_mentah || "";
        const parsedFallback = parseOCRText(rawText);

        // Map amount from total_harga or total with fallback to regex parsing
        let amountVal = finalOcr.total_harga !== undefined && finalOcr.total_harga !== null ? finalOcr.total_harga : finalOcr.total;
        if (amountVal === undefined || amountVal === null) {
            amountVal = parsedFallback.amount;
        }

        // Parse amount string if necessary
        let amount = 0;
        if (typeof amountVal === "string") {
            const match = amountVal.match(/\d[\d.,]*/);
            amount = match ? parseInt(match[0].replace(/[.,]/g, "")) : 0;
        } else if (typeof amountVal === "number") {
            amount = amountVal;
        }

        // 3. VALIDATION: amount wajib
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Amount is required and could not be parsed from receipt" });
        }

        // Extract merchant and transaction date
        const merchant = finalOcr.merchant && finalOcr.merchant !== "Tidak ditemukan" ? finalOcr.merchant : (parsedFallback.merchant || "Unknown");
        const transaction_date = finalOcr.date && finalOcr.date !== "Tidak ditemukan" ? finalOcr.date : (parsedFallback.date || new Date().toISOString().split("T")[0]);

        // Clean and Map category
        let categoryNameAI = finalOcr.category_name || finalOcr.category || finalOcr.classes || "Other";
        if (typeof categoryNameAI === "string") {
            categoryNameAI = categoryNameAI.replace(/[[\]'"\r\n]/g, "").trim();
        }
        
        // Map to standard DB category to prevent foreign key errors and preserve reporting consistency
        const cleanCategoryName = mapCategory(categoryNameAI);
        const categoryRecord = await getCategoryByName(cleanCategoryName);
        const categoryId = categoryRecord?.id || 1;
        const finalCategoryName = cleanCategoryName;

        // Parse items (ensure items is an array, fallback to regex items parser if empty)
        let items = [];
        if (Array.isArray(finalOcr.items)) {
            items = finalOcr.items;
        } else if (typeof finalOcr.items === "string") {
            try {
                const parsedItems = JSON.parse(finalOcr.items);
                items = Array.isArray(parsedItems) ? parsedItems : [finalOcr.items];
            } catch {
                items = [finalOcr.items];
            }
        }
        
        if (items.length === 0 && rawText) {
            // Use local fallback item parsing
            const fallbackItems = parseItemsFromOCR(rawText);
            items = fallbackItems.map(item => item.name); // Extract item names
        }

        // Extract confidence & calculate need_review
        let confidence = null;
        if (finalOcr.confidence !== undefined && finalOcr.confidence !== null) {
            confidence = parseFloat(finalOcr.confidence);
        }

        // 3. VALIDATION: jika confidence < 0.75 maka need_review = true
        let need_review = false;
        if (confidence !== null) {
            need_review = confidence < 0.75;
        } else if (finalOcr.need_review !== undefined) {
            need_review = !!finalOcr.need_review;
        }

        // 4. Save transaction with new DB fields: confidence, need_review, raw_text, cleaned_text, items
        const mappedData = {
            user_id: req.user.id,
            category_id: categoryId,
            amount: amount,
            merchant: merchant,
            transaction_date: transaction_date,
            source: "ocr", // standard source is "ocr" as per requirement
            type: "expense",
            confidence: confidence,
            need_review: need_review,
            raw_text: rawText,
            cleaned_text: finalOcr.cleaned_text || null,
            items: items,
        };

        const result = await createTransaction(mappedData);

        // Add Notification
        await createNotification(
            req.user.id,
            "expense",
            `Pengeluaran baru (Auto) tercatat: Rp ${Number(result.amount).toLocaleString()}`,
        );

        // 6. Response final backend matching the exact schema requirement:
        res.json({
            id: result?.id,
            merchant: result?.merchant || merchant,
            amount: Number(result?.amount || amount),
            category_id: categoryId,
            category_name: finalCategoryName,
            confidence: confidence,
            need_review: need_review,
            items: items,
            raw_text: rawText,
            source: result?.source || "ocr",
            type: result?.type || "expense",
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
