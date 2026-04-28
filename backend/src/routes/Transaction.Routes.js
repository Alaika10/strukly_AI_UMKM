import express from "express";
import {
    create,
    createFromOCR,
    getAll,
    update,
    remove,
} from "../controllers/TransactionController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/ocr", verifyToken, createFromOCR);
router.post("/", verifyToken, create);
router.get("/", verifyToken, getAll);
router.put("/", verifyToken, update);
router.put("/:id", verifyToken, update);
router.delete("/", verifyToken, remove);
router.delete("/:id", verifyToken, remove);

export default router;
