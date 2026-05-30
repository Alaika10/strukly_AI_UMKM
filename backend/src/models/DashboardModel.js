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
        total_income: Number(data.income) || 0,
        total_expense: Number(data.expense) || 0,
        balance: (Number(data.income) || 0) - (Number(data.expense) || 0),
    };
};

export const getAnalyticsData = async (userId) => {
    const summaryResult = await pool.query(
        `
        SELECT 
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
        FROM transactions
        WHERE user_id = $1 AND is_deleted = FALSE
        `,
        [userId]
    );

    const monthlyResult = await pool.query(
        `
        SELECT 
            TO_CHAR(transaction_date, 'YYYY-MM') as month,
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
        FROM transactions
        WHERE user_id = $1 AND is_deleted = FALSE
        GROUP BY month
        ORDER BY month ASC
        LIMIT 12
        `,
        [userId]
    );

    const categoryResult = await pool.query(
        `
        SELECT 
            c.name as category,
            SUM(t.amount) as total
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = $1 AND t.type = 'expense' AND t.is_deleted = FALSE
        GROUP BY c.name
        ORDER BY total DESC
        LIMIT 5
        `,
        [userId]
    );

    const data = summaryResult.rows[0];

    return {
        monthly_income: monthlyResult.rows.map(row => ({ month: row.month, amount: Number(row.income) })),
        monthly_expense: monthlyResult.rows.map(row => ({ month: row.month, amount: Number(row.expense) })),
        top_categories: categoryResult.rows.map(row => ({ category: row.category, amount: Number(row.total) })),
        total_income: Number(data.total_income) || 0,
        total_expense: Number(data.total_expense) || 0,
    };
};
