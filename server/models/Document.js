import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    filename: String,
    originalName: String,
    path: String,
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;
