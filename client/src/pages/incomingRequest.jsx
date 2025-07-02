import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { Link } from "react-router-dom";

export default function IncomingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRequestId, setLoadingRequestId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/requests/incoming");
      setRequests(res.data);
    } catch (err) {
      console.error("Error loading requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setLoadingRequestId(id);
    try {
      await axios.put(`/requests/${id}/status`, { status });
      await fetchRequests();
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setLoadingRequestId(null);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <Link to="/dashboard" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        🔙 Go to Dashboard
      </Link>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">📥 Incoming Signature Requests</h2>

      {loading ? (
        <div className="text-center text-gray-600">Loading requests...</div>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No incoming requests.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req._id} className="bg-white p-4 rounded-lg shadow border">
              <p><strong>From:</strong> {req.sender?.name} ({req.sender?.email})</p>
              <p><strong>Document:</strong> {req.document?.filename || "Unknown"}</p>
              <p><strong>Message:</strong> {req.message || "—"}</p>
              <p><strong>Status:</strong> <span className="text-blue-600">{req.status}</span></p>

              {req.status === "Pending" && (
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => updateStatus(req._id, "Signed")}
                    className={`px-3 py-1 rounded text-white ${
                      loadingRequestId === req._id
                        ? "bg-green-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    disabled={loadingRequestId === req._id}
                  >
                    {loadingRequestId === req._id ? "Processing..." : "✅ Accept"}
                  </button>

                  <button
                    onClick={() => updateStatus(req._id, "Rejected")}
                    className={`px-3 py-1 rounded text-white ${
                      loadingRequestId === req._id
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                    disabled={loadingRequestId === req._id}
                  >
                    {loadingRequestId === req._id ? "Processing..." : "❌ Reject"}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
