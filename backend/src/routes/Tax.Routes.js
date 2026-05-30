import express from "express";
import { getTax, getTaxNotification } from "../controllers/TaxController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getTax);
router.get("/notification", verifyToken, getTaxNotification);

export default router;
