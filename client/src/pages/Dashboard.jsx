import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axiosInstance.get("/docs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDocs(res.data);
      } catch (err) {
        setError("Failed to load documents.");
        console.error(err);
      }
    };

    fetchDocs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">📄 Your Uploaded Documents</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map((doc) => (
          <div
            key={doc._id}
            className="bg-white shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition"
          >
            <h3 className="font-semibold text-lg truncate">{doc.originalName}</h3>
            <p className="text-sm text-gray-500 mt-1">Uploaded on: {new Date(doc.createdAt).toLocaleDateString()}</p>

            <a
              href={`http://localhost:5000/${doc.path.replace("\\", "/")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Preview PDF
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
