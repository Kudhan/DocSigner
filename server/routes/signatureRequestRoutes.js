import express from 'express';
import SignatureRequest from '../models/signatureModel.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Send Request
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { recipientId, documentId, message } = req.body;

    const newRequest = new SignatureRequest({
      sender: req.user.id,
      recipient: recipientId,
      documentId, // ✅ use correct field
      message,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send request', error: error.message });
  }
});

// Get Incoming Requests
router.get('/incoming', authMiddleware, async (req, res) => {
  try {
    const requests = await SignatureRequest.find({ recipient: req.user.id })
      .populate('sender', 'name email')
      .populate('documentId'); // ✅ use correct field
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load incoming requests', error: error.message });
  }
});

// Get Outgoing Requests
router.get('/outgoing', authMiddleware, async (req, res) => {
  try {
    const requests = await SignatureRequest.find({ sender: req.user.id })
      .populate('recipient', 'name email')
      .populate('documentId'); // ✅ use correct field
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load outgoing requests', error: error.message });
  }
});

// Update Request Status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Signed', 'Rejected'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const request = await SignatureRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
});



export default router;
