// client/src/pages/UploadPage.jsx
import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("📁 Selected File:", selectedFile);
    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("⚠️ Please choose a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file); // This must match your multer field name

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
}

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleUpload}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-xl font-bold mb-4">Upload PDF</h2>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select a PDF file:
        </label>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full mb-4 px-2 py-1 border border-gray-300 rounded"
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Upload
        </button>

        {message && (
          <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
};

export default UploadPage;
