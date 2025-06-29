// server/index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";


// Routes
import authRoutes from "./routes/authRoutes.js";
import docRoutes from "./routes/docRoutes.js";
import signatureRoutes from "./routes/signatureRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Allows frontend (e.g., on port 3000) to talk to backend (port 5000)
app.use(express.json()); // Parses incoming JSON in requests
const __dirname = path.resolve(); // to resolve absolute path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/docs",docRoutes);


app.use("/api/signatures", signatureRoutes);



// Basic test route
app.get("/", (req, res) => {
  res.send("API is running ✅");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ MongoDB connected");
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});
