import pool from "../config/db.js";

export const getCategoryByName = async (name) => {
    const result = await pool.query(
        `SELECT id FROM categories WHERE LOWER(name) = LOWER($1) LIMIT 1`,
        [name],
    );

    return result.rows[0];
};

export const getAllCategories = async (type) => {
    let query = `SELECT id, name, type FROM categories`;
    const params = [];

    if (type) {
        query += ` WHERE type = $1`;
        params.push(type);
    }
    
    query += ` ORDER BY id ASC`;

    const result = await pool.query(query, params);
    return result.rows;
};

export const getCategoryById = async (id) => {
    const result = await pool.query(
        `SELECT id, name, type FROM categories WHERE id = $1 LIMIT 1`,
        [id],
    );

    return result.rows[0];
};
