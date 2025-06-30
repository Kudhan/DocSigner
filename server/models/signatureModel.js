import mongoose from "mongoose";

const signatureRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true }, // ✅ renamed from 'document'
  status: { type: String, enum: ['Pending', 'Signed', 'Rejected'], default: 'Pending' },
  message: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const SignatureRequest = mongoose.model("SignatureRequest", signatureRequestSchema);
export default SignatureRequest;
