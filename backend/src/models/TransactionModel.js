import pool from "../config/db.js";

export const createTransaction = async (data) => {
    const query = `
    INSERT INTO transactions 
    (user_id, category_id, amount, merchant, transaction_date, source, type, confidence, need_review, raw_text, cleaned_text, items)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
        data.confidence !== undefined && data.confidence !== null ? parseFloat(data.confidence) : null,
        data.need_review !== undefined && data.need_review !== null ? !!data.need_review : false,
        data.raw_text || null,
        data.cleaned_text || null,
        data.items ? (typeof data.items === "string" ? data.items : JSON.stringify(data.items)) : null,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};

export const getTransactions = async (userId) => {
    const query = `
    SELECT t.*, c.name as category_name
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

export const bulkCreateTransactions = async (transactions) => {
    if (!transactions || transactions.length === 0) return [];

    const values = [];
    const placeholders = [];

    let i = 1;
    transactions.forEach(t => {
        placeholders.push(`($${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++})`);
        values.push(
            t.user_id,
            t.category_id || 1,
            t.amount,
            t.merchant || 'Synthetic',
            t.transaction_date || new Date().toISOString().split("T")[0],
            t.source || 'manual',
            t.type || 'expense',
            t.confidence !== undefined && t.confidence !== null ? parseFloat(t.confidence) : null,
            t.need_review !== undefined && t.need_review !== null ? !!t.need_review : false,
            t.raw_text || null,
            t.cleaned_text || null,
            t.items ? (typeof t.items === "string" ? t.items : JSON.stringify(t.items)) : null
        );
    });

    const query = `
    INSERT INTO transactions 
    (user_id, category_id, amount, merchant, transaction_date, source, type, confidence, need_review, raw_text, cleaned_text, items)
    VALUES ${placeholders.join(', ')}
    RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows;
};
