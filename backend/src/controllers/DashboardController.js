import { getSummary, getAnalyticsData } from "../models/DashboardModel.js";

export const summary = async (req, res) => {
    try {
        const userId = req.user?.id || req.query.user_id;
        const result = await getSummary(userId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const analytics = async (req, res) => {
    try {
        const userId = req.user?.id || req.query.user_id;
        const result = await getAnalyticsData(userId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
