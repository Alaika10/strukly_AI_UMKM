import { bulkCreateTransactions } from "../models/TransactionModel.js";

export const importSyntheticData = async (req, res) => {
    try {
        const { user_id, transactions } = req.body;

        if (!user_id || !transactions || !Array.isArray(transactions)) {
            return res.status(400).json({ error: "user_id and an array of transactions are required" });
        }

        // Tag all transactions with the user_id
        const mappedTransactions = transactions.map(t => ({
            ...t,
            user_id: user_id
        }));

        const result = await bulkCreateTransactions(mappedTransactions);

        res.json({
            message: "Synthetic data imported successfully",
            count: result.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
