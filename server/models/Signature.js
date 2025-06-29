import mongoose from "mongoose";

const signatureSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  page: { type: Number, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  color: { type: String, default: "#000000" },
  size: { type: Number, default: 16 },
  style: { type: String, default: "cursive" }
}, { timestamps: true });


const Signature = mongoose.model("Signature", signatureSchema);
export default Signature;
