import express from "express";
import SignatureAudit from "../models/signatureAuditModel.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Log signature event
router.post("/log", authMiddleware, async (req, res) => {
  try {
    const { documentId } = req.body;
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const log = await SignatureAudit.create({
      user: req.user.id,
      document: documentId,
      ipAddress,
    });

    res.status(201).json(log);
  } catch (error) {
    console.error("❌ Error logging signature:", error.message);
    res.status(500).json({ message: "Failed to log signature", error: error.message });
  }
});

// Fetch audit logs by document
router.get("/:documentId", authMiddleware, async (req, res) => {
  try {
    const logs = await SignatureAudit.find({ document: req.params.documentId })
      .populate("user", "name email")
      .sort({ signedAt: -1 });
    res.json(logs);
  } catch (error) {
    console.error("❌ Error fetching logs:", error.message);
    res.status(500).json({ message: "Failed to fetch logs", error: error.message });
  }
});

export default router;
