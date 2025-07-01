import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getUserDocs, uploadDoc, getDocById } from "../controllers/docController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/upload", protect, upload.single("pdf"), uploadDoc); // ✅ uploads to Cloudinary
router.get("/", protect, getUserDocs);
router.get("/:id", protect, getDocById);

export default router;
