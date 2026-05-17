import express from "express";
import { summary } from "../controllers/DashboardController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/summary", verifyToken, summary);

export default router;
