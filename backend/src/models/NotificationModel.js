import pool from "../config/db.js";

export const createNotification = async (userId, type, message) => {
    const result = await pool.query(
        `INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3) RETURNING *`,
        [userId, type, message],
    );
    return result.rows[0];
};

export const getNotificationsByUser = async (userId) => {
    const result = await pool.query(
        `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId],
    );
    return result.rows;
};

export const markAsRead = async (id) => {
    const result = await pool.query(
        `UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *`,
        [id],
    );
    return result.rows[0];
};

export const deleteOldNotifications = async (userId) => {
    await pool.query(`DELETE FROM notifications WHERE user_id = $1`, [userId]);
};
