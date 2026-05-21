import { calculateTax } from "../models/TaxModel.js";

export const getTax = async (req, res) => {
    try {
        const userId = req.user?.id || req.query.user_id;

        const result = await calculateTax(userId);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
