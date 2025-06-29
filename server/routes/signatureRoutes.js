import express from "express";
import { saveSignature, getSignaturesForDoc } from "../controllers/signatureController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, saveSignature);
router.get("/:docId", protect, getSignaturesForDoc);

export default router;
