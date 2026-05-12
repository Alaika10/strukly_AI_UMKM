import pool from "../config/db.js";

export const createUser = async (name, email, password) => {
    const result = await pool.query(
        `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email`,
        [name, email, password],
    );

    return result.rows[0];
};

export const findUserByEmail = async (email) => {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
        email,
    ]);

    return result.rows[0];
};

export const updatePassword = async (id, password) => {
    await pool.query(`UPDATE users SET password = $1 WHERE id = $2`, [
        password,
        id,
    ]);
};

export const updateProfile = async (id, data) => {
    const { name, business_name, business_category, logo_url } = data;
    const result = await pool.query(
        `UPDATE users 
         SET name = $1, business_name = $2, business_category = $3, logo_url = $4 
         WHERE id = $5 
         RETURNING id, name, email, business_name, business_category, logo_url`,
        [name, business_name, business_category, logo_url, id],
    );
    return result.rows[0];
};

export const updateSecurity = async (id, data) => {
    const { two_factor_enabled } = data;
    const result = await pool.query(
        `UPDATE users 
         SET two_factor_enabled = $1 
         WHERE id = $2 
         RETURNING id, two_factor_enabled`,
        [two_factor_enabled, id],
    );
    return result.rows[0];
};

export const updateNotificationSettings = async (id, data) => {
    const {
        notif_stock_reminder,
        notif_daily_summary,
        notif_tax_reminder,
        notif_monthly_report,
    } = data;
    const result = await pool.query(
        `UPDATE users 
         SET notif_stock_reminder = $1, notif_daily_summary = $2, notif_tax_reminder = $3, notif_monthly_report = $4 
         WHERE id = $5 
         RETURNING id, notif_stock_reminder, notif_daily_summary, notif_tax_reminder, notif_monthly_report`,
        [
            notif_stock_reminder,
            notif_daily_summary,
            notif_tax_reminder,
            notif_monthly_report,
            id,
        ],
    );
    return result.rows[0];
};

export const findUserById = async (id) => {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return result.rows[0];
};

