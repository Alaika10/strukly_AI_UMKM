import express from "express";
import { forecast } from "../controllers/ForecastController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, forecast);

export default router;
