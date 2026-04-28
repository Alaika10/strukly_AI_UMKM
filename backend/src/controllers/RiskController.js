import { getRisk } from "../models/RiskModel.js";

export const risk = async (req, res) => {
    try {
        const userId = req.query.user_id;

        const result = await getRisk(userId);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
