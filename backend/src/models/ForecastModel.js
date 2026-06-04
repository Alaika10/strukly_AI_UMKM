import pool from "../config/db.js";

export const getDailyIncome = async (userId) => {
    const result = await pool.query(
        `
    SELECT 
      transaction_date,
      SUM(amount) as total_income
    FROM transactions
    WHERE user_id = $1 
      AND type = 'income'
      AND is_deleted = FALSE
    GROUP BY transaction_date
    ORDER BY transaction_date ASC
    `,
        [userId],
    );

    return result.rows;
};

export const getDailyExpense = async (userId) => {
  const result = await pool.query(
    `
    SELECT 
      transaction_date,
      SUM(amount) as total_expense
    FROM transactions
    WHERE user_id = $1 
      AND type = 'expense'
      AND is_deleted = FALSE
    GROUP BY transaction_date
    ORDER BY transaction_date ASC
    `,
    [userId]
  );
	
    return result.rows;
};
