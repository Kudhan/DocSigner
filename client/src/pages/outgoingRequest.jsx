import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { Link } from "react-router-dom";

export default function OutgoingRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("/requests/outgoing");
        setRequests(res.data);
      } catch (err) {
        console.error("Error loading outgoing:", err);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <Link to="/dashboard" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        🔙 Go to Dashboard
      </Link>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">📤 Outgoing Signature Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500">No outgoing requests.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req._id} className="bg-white p-4 rounded-lg shadow border">
              <p><strong>To:</strong> {req.recipient?.name} ({req.recipient?.email})</p>
              <p><strong>Document:</strong> {req.document?.filename || "Unknown"}</p>
              <p><strong>Message:</strong> {req.message || "—"}</p>
              <p><strong>Status:</strong> <span className="text-blue-600">{req.status}</span></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
