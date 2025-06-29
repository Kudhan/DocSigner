import Document from "../models/Document.js";

export const uploadDoc = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const doc = await Document.create({
      user: req.user.id,
      filename: req.file.filename,
      path: req.file.path,
      originalName: req.file.originalname,
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

export const getUserDocs = async (req, res) => {
  try {
    const docs = await Document.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching documents", error: err.message });
  }
};



export const getDocById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Error fetching document", error: err.message });
  }
};

