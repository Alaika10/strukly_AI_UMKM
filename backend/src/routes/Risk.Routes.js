import express from "express";
import { risk } from "../controllers/RiskController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, risk);
export default router;
