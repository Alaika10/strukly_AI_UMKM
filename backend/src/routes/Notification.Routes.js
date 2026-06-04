import express from "express";
import {
    getNotifications,
    markNotificationRead,
} from "../controllers/NotificationController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getNotifications);
router.put("/read/:id", verifyToken, markNotificationRead);

export default router;
