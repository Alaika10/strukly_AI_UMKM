import pool from "../config/db.js";

export const getRisk = async (userId) => {
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

    const income = Number(result.rows[0].income) || 0;
    const expense = Number(result.rows[0].expense) || 0;
    const profit = income - expense;

    let status = "";

    if (profit > 0) {
        status = "AMAN";
    } else if (profit === 0) {
        status = "RAWAN";
    } else {
        status = "RUGI";
    }

    return {
        income,
        expense,
        profit,
        status,
    };
};
