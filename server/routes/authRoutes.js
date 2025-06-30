// server/routes/authRoutes.js
import express from "express";
import { register, login } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js"; // Import User model

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/all", authMiddleware, async (req, res) => {
  try {
    console.log("✅ User in /all route:", req.user); // ✅ Add this
    const users = await User.find({ _id: { $ne: req.user.id } }).select("name email");
    res.json(users);
  } catch (error) {
    console.error("🔥 Error in /api/auth/all:", error); // ✅ Log error clearly
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});



export default router;
