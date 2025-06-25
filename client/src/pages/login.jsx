import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token); // store JWT
      setMessage("✅ Login successful!");
      setTimeout(() => navigate("/upload"), 1000); // go to upload page (Day 3)
    } catch (err) {
      setMessage("❌ Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input name="email" placeholder="Email" onChange={handleChange} className="w-full mb-2 px-3 py-2 border rounded" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full mb-4 px-3 py-2 border rounded" />
        <button className="bg-green-500 text-white px-4 py-2 rounded w-full">Login</button>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
