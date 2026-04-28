import pool from "../config/db.js";

export const getCategoryByName = async (name) => {
    const result = await pool.query(
        `SELECT id FROM categories WHERE LOWER(name) = LOWER($1) LIMIT 1`,
        [name],
    );

    return result.rows[0];
};
