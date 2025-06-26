import express from "express";
import multer from "multer";
import protect from "../middleware/authMiddleware.js"
import { getUserDocs, uploadDoc } from "../controllers/docController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/upload", protect, upload.single("pdf"), uploadDoc);
router.get("/",protect,getUserDocs);

// ✅ Export the router
export default router;
