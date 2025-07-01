import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();
// Routes
import authRoutes from "./routes/authRoutes.js";
import docRoutes from "./routes/docRoutes.js";
import signatureRoutes from "./routes/signatureRoutes.js";
import signatureRequestRoutes from "./routes/signatureRequestRoutes.js";
import signatureAuditRoutes from "./routes/signatureAuditRoutes.js";

// Load env


const app = express();
app.use(cors());
app.use(express.json());

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/docs", docRoutes);
app.use("/api/signatures", signatureRoutes);
app.use("/api/requests", signatureRequestRoutes);
app.use("/api/audit", signatureAuditRoutes);


app.get("/", (req, res) => {
  res.send("API is running ✅");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
