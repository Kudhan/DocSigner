import mongoose from "mongoose";

const signatureAuditSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  document: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
  signedAt: { type: Date, default: Date.now },
  ipAddress: { type: String },
});

const SignatureAudit = mongoose.model("SignatureAudit", signatureAuditSchema);
export default SignatureAudit;
