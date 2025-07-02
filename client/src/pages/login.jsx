import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { FiLock, FiMail } from "react-icons/fi";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      setMessage("✅ Login successful!");
      setTimeout(() => navigate("/dashboard"), 1000); // redirect to dashboard
    } catch (err) {
      setMessage("❌ Login failed. Please check your credentials.");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-green-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white shadow-2xl rounded-xl p-8 border"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        <div className="mb-4 relative">
          <FiMail className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        <div className="mb-6 relative">
          <FiLock className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="password"
            name="password"
            required
            placeholder="Enter your password"
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        <button
  type="submit"
  disabled={loading}
  className={`w-full ${
    loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
  } text-white font-medium py-2 rounded transition flex items-center justify-center`}
>
  {loading ? (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>

    
  ) : (
    "🔐 Login"
  )}
</button>


        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/" className="text-green-600 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
