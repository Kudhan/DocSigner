import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const RequestDashboard = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [statusLoading, setStatusLoading] = useState(""); // request ID being updated
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axiosInstance.get("/signature-requests");
        setIncoming(res.data.incoming);
        setOutgoing(res.data.outgoing);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load requests");
      }
    };
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setStatusLoading(id);
    try {
      await axiosInstance.put(`/requests/${id}/status`, { status: newStatus });
      setIncoming((prev) =>
        prev.map((req) => (req._id === id ? { ...req, status: newStatus } : req))
      );
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update status");
    } finally {
      setStatusLoading(""); // reset loading
    }
  };

  const renderRequestCard = (req, type) => (
    <div key={req._id} className="bg-white p-4 rounded shadow mb-4">
      <p>
        <strong>Document ID:</strong> {req.documentId?._id}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        <span
          className={`${
            req.status === "Accepted"
              ? "text-green-600"
              : req.status === "Rejected"
              ? "text-red-600"
              : "text-yellow-600"
          } font-medium`}
        >
          {req.status}
        </span>
      </p>
      <p>
        <strong>{type === "incoming" ? "From" : "To"}:</strong>{" "}
        {type === "incoming" ? req.sender.name : req.recipient.name}
      </p>

      <div className="flex flex-wrap gap-4 mt-3">
        <button
          onClick={() => navigate(`/sign/${req.documentId._id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
        >
          📄 View PDF
        </button>

        {type === "incoming" && req.status === "Pending" && (
          <>
            <button
              onClick={() => handleStatusChange(req._id, "Accepted")}
              disabled={statusLoading === req._id}
              className={`bg-green-600 text-white px-4 py-1 rounded ${
                statusLoading === req._id ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {statusLoading === req._id ? "Accepting..." : "✅ Accept"}
            </button>

            <button
              onClick={() => handleStatusChange(req._id, "Rejected")}
              disabled={statusLoading === req._id}
              className={`bg-red-600 text-white px-4 py-1 rounded ${
                statusLoading === req._id ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {statusLoading === req._id ? "Rejecting..." : "❌ Reject"}
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">📨 Signature Requests</h1>

      <h2 className="text-xl font-semibold mb-2">Incoming</h2>
      {incoming.length > 0 ? (
        incoming.map((req) => renderRequestCard(req, "incoming"))
      ) : (
        <p className="text-gray-500 mb-4">No incoming requests</p>
      )}

      <h2 className="text-xl font-semibold mt-6 mb-2">Outgoing</h2>
      {outgoing.length > 0 ? (
        outgoing.map((req) => renderRequestCard(req, "outgoing"))
      ) : (
        <p className="text-gray-500">No outgoing requests</p>
      )}
    </div>
  );
};

export default RequestDashboard;
