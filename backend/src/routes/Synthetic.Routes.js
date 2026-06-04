import express from "express";
import { importSyntheticData } from "../controllers/SyntheticController.js";

// Optional: you can add an admin verification middleware here in the future
const router = express.Router();

router.post("/import", importSyntheticData);

export default router;
