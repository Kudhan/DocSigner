import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const RequestSignature = () => {
  const [recipients, setRecipients] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState({
    recipientId: "",
    documentId: "",
    message: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchUsersAndDocs = async () => {
      try {
        const [userRes, docRes] = await Promise.all([
          axiosInstance.get("/auth/all"),
          axiosInstance.get("/docs"),
        ]);

        const users = userRes.data || [];
        const filteredUsers = currentUser
          ? users.filter((u) => u._id !== currentUser._id)
          : users;

        setRecipients(filteredUsers);
        setDocuments(docRes.data || []);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        toast.error("Failed to load users or documents.");
      }
    };

    if (token) {
      fetchUsersAndDocs();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!formData.recipientId || !formData.documentId) {
      toast.error("Please select recipient and document.");
      return;
    }

    try {
      await axiosInstance.post("/requests/send", formData);
      toast.success("✅ Signature request sent!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error("Send failed:", err);
      toast.error("Failed to send request");
    }
  };

  if (!token) return <p className="text-center text-red-500">Please login again.</p>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6">
      <Toaster />
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow border">
        <Link
          to="/dashboard"
          className="text-blue-600 text-sm hover:underline inline-block mb-4"
        >
          🔙 Back to Dashboard
        </Link>
        <h2 className="text-2xl font-bold mb-4">📨 Send Signature Request</h2>

        <form onSubmit={handleSend} className="space-y-4">
          {/* Recipient */}
          <div>
            <label className="text-sm font-medium">Recipient</label>
            <select
              name="recipientId"
              value={formData.recipientId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select a recipient</option>
              {recipients.length > 0 ? (
                recipients.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))
              ) : (
                <option disabled>No other users found</option>
              )}
            </select>
          </div>

          {/* Document */}
          <div>
            <label className="text-sm font-medium">Document</label>
            <select
              name="documentId"
              value={formData.documentId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select a document</option>
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.originalName}
                  </option>
                ))
              ) : (
                <option disabled>No documents uploaded</option>
              )}
            </select>
          </div>

          {/* Message */}
          <textarea
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            placeholder="Optional message..."
            className="w-full border rounded px-3 py-2"
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700"
          >
            🚀 Send Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestSignature;
