import { calculateTax } from "../models/taxModel.js";

export const getTax = async (req, res) => {
    try {
        const userId = req.query.user_id;

        const result = await calculateTax(userId);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
