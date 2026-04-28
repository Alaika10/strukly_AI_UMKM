import pool from "../config/db.js";

export const calculateTax = async (userId) => {
    const result = await pool.query(
        `
    SELECT 
      SUM(amount) AS income
    FROM transactions
    WHERE user_id = $1 
      AND type = 'income'
      AND is_deleted = FALSE
    `,
        [userId],
    );

    const income = Number(result.rows[0].income) || 0;

    const tax = income * 0.005;

    return {
        income,
        tax,
    };
};
