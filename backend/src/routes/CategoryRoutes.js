import express from "express";
import { getCategories } from "../controllers/CategoryController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Apply auth middleware if you want only authenticated users to get categories
router.get("/", verifyToken, getCategories);

export default router;
