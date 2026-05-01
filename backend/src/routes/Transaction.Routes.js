import express from "express";
import multer from "multer";
import {
    create,
    createFromOCR,
    getAll,
    update,
    remove,
} from "../controllers/TransactionController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = multer();

router.post("/ocr", verifyToken, upload.single("file"), createFromOCR);

router.post("/", verifyToken, create);
router.get("/", verifyToken, getAll);
router.put("/:id", verifyToken, update);
router.delete("/:id", verifyToken, remove);

export default router;
