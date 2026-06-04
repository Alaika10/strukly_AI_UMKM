import express from "express";
import { insight } from "../controllers/InsightController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, insight);

export default router;
