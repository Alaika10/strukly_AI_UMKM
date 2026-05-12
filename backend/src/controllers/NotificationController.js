import {
    getNotificationsByUser,
    markAsRead,
} from "../models/NotificationModel.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await getNotificationsByUser(userId);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await markAsRead(id);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
