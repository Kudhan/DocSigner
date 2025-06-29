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
