import Signature from "../models/Signature.js";

export const saveSignature = async (req, res) => {
  try {
    const sig = await Signature.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(sig);
  } catch (err) {
    res.status(500).json({ message: "Signature save failed", error: err.message });
  }
};

export const getSignaturesForDoc = async (req, res) => {
  try {
    const signatures = await Signature.find({ documentId: req.params.docId });
    res.json(signatures);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch signatures", error: err.message });
  }
};


export const deleteSignature = async (req, res) => {
  try {
    const signature = await Signature.findById(req.params.id);
    if (!signature) {
      return res.status(404).json({ message: "Signature not found" });
    }

    // Optional: Check ownership (only allow user who created it)
    if (signature.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await signature.deleteOne();
    res.json({ message: "Signature deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
