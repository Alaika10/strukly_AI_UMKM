import { getAllCategories } from "../models/CategoryModel.js";

export const getCategories = async (req, res) => {
    try {
        const type = req.query.type; // optional: 'income' or 'expense'
        const categories = await getAllCategories(type);
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
