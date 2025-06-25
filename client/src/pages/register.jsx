import React, { useState } from "react";

import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/auth/register", formData);
      setMessage("✅ Registered! Now login.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMessage("❌ Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input name="name" placeholder="Name" onChange={handleChange} className="w-full mb-2 px-3 py-2 border rounded" />
        <input name="email" placeholder="Email" onChange={handleChange} className="w-full mb-2 px-3 py-2 border rounded" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full mb-4 px-3 py-2 border rounded" />
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">Register</button>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
