// ✅ Polished UploadPage.jsx
import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("📁 Selected File:", selectedFile);
    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!file) {
      setMessage("⚠️ Please choose a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await axiosInstance.post("/docs/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("✅ Upload Response:", res.data);
      setMessage("✅ File uploaded!");
      setFile(null);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Unknown error";
      console.error("❌ Upload failed:", errorMsg);
      setMessage("❌ Upload failed: " + errorMsg);
    }finally{
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleUpload}
        className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 border"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          📤 Upload PDF Document
        </h2>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select a PDF file:
        </label>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded transition"
        >
          📎 Upload PDF
        </button>

        {message && (
          <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
};

export default UploadPage;
