import express from "express";
import { alert } from "../controllers/AlertController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, alert);

export default router;
