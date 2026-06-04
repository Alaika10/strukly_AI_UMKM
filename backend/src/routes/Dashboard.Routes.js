import express from "express";
import { summary, analytics } from "../controllers/DashboardController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/summary", verifyToken, summary);
router.get("/analytics", verifyToken, analytics);

export default router;
