import SignatureRequest from "../models/signatureModel.js";

export const sendRequest = async (req, res) => {
  try {
    const request = await SignatureRequest.create({
      sender: req.user.id,
      recipient: req.body.recipient,
      documentId: req.body.documentId,
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: "Failed to send request", error: err.message });
  }
};

export const getRequestsForUser = async (req, res) => {
  try {
    const requests = await SignatureRequest.find({ recipient: req.user.id }).populate("documentId sender", "name email");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch requests", error: err.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await SignatureRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
};
