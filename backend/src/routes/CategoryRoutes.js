import express from "express";
import { getCategories } from "../controllers/CategoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware if you want only authenticated users to get categories
router.get("/", authMiddleware, getCategories);

export default router;
