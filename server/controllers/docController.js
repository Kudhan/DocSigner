import Document from "../models/Document.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload PDF and store in DB
export const uploadDoc = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // ✅ Cloudinary handles the upload already
    const { originalname } = req.file;
    const { path: url, filename } = req.file; // `path` is Cloudinary secure_url

    // ✅ Save to MongoDB
    const doc = await Document.create({
      user: req.user.id,
      filename,          // Cloudinary public_id
      path: url,         // Cloudinary secure_url
      originalName: originalname,
    });

    // ✅ Do not unlink anything – file is not stored locally
    res.status(201).json(doc);
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

// ✅ Get all user documents
export const getUserDocs = async (req, res) => {
  try {
    const docs = await Document.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching documents", error: err.message });
  }
};

// ✅ Get single document by ID
export const getDocById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Error fetching document", error: err.message });
  }
};
