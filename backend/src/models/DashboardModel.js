import pool from "../config/db.js";

export const getSummary = async (userId) => {
    const result = await pool.query(
        `
    SELECT 
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
    FROM transactions
    WHERE user_id = $1 AND is_deleted = FALSE
    `,
        [userId],
    );

    const data = result.rows[0];

    return {
        income: Number(data.income) || 0,
        expense: Number(data.expense) || 0,
        profit: (Number(data.income) || 0) - (Number(data.expense) || 0),
    };
};
