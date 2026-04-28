import { getSummary } from "../models/dashboardModel.js";

export const summary = async (req, res) => {
    try {
        const userId = req.query.user_id;
        const result = await getSummary(userId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
