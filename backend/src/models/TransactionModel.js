import pool from "../config/db.js";

export const createTransaction = async (data) => {
    const query = `
    INSERT INTO transactions 
    (user_id, category_id, amount, merchant, transaction_date, source, type)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *;
  `;

    const values = [
        data.user_id,
        data.category_id,
        data.amount,
        data.merchant,
        data.transaction_date,
        data.source,
        data.type,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};

export const getTransactions = async (userId) => {
    const query = `
    SELECT t.*, c.name as category
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = $1 AND t.is_deleted = FALSE
    ORDER BY t.created_at DESC;
  `;

    const result = await pool.query(query, [userId]);
    return result.rows;
};

export const updateTransaction = async (id, data, userId) => {
    const fields = [];
    const values = [];

    if (data.amount !== undefined) {
        fields.push(`amount = $${values.length + 1}`);
        values.push(data.amount);
    }

    if (data.category_id !== undefined) {
        fields.push(`category_id = $${values.length + 1}`);
        values.push(data.category_id);
    }

    if (data.merchant !== undefined) {
        fields.push(`merchant = $${values.length + 1}`);
        values.push(data.merchant);
    }

    if (fields.length === 0) {
        return null;
    }

    fields.push(`is_edited = TRUE`);
    fields.push(`updated_at = NOW()`);

    const query = `
    UPDATE transactions
    SET ${fields.join(",\n        ")}
    WHERE id = $${values.length + 1} AND user_id = $${values.length + 2}
    RETURNING *;
  `;

    values.push(id, userId);

    const result = await pool.query(query, values);
    return result.rows[0];
};

export const deleteTransaction = async (id, userId) => {
    const result = await pool.query(
        `
    UPDATE transactions 
    SET is_deleted = TRUE 
    WHERE id = $1 AND user_id = $2
    RETURNING *;
    `,
        [id, userId],
    );

    return result.rows[0];
};
