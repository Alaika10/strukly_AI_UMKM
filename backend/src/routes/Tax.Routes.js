import express from "express";
import { getTax } from "../controllers/TaxController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getTax);

export default router;
