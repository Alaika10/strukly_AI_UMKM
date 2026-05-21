import express from "express";
import {
    getProfile,
    updateProfileController,
    updateSecurityController,
    updateNotificationsController,
} from "../controllers/SettingsController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfileController);
router.put("/security", verifyToken, updateSecurityController);
router.put("/notifications", verifyToken, updateNotificationsController);

export default router;
