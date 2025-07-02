import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [docs, setDocs] = useState([]);
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const docRes = await axiosInstance.get("/docs");
        const incoming = await axiosInstance.get("/requests/incoming");
        const outgoing = await axiosInstance.get("/requests/outgoing");
        setDocs(docRes.data);
        setRequests({ incoming: incoming.data, outgoing: outgoing.data });
      } catch (err) {
        setError("Failed to load dashboard data.");
        console.error(err);
      }finally{
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <svg
        className="animate-spin h-10 w-10 text-indigo-600"
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
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-100 to-indigo-50 p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">📋 Dashboard</h2>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/upload")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
          >
            ⬆️ Upload New PDF
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
          >
            🔓 Sign Out
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Uploaded Documents */}
        <div>
          <h3 className="text-xl font-semibold mb-4">📄 Uploaded Documents</h3>
          {docs.length === 0 ? (
            <p className="text-gray-500">No documents uploaded.</p>
          ) : (
            <div className="space-y-4">
              {docs.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-white rounded-xl shadow-md p-4 border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <div>
                    <p className="font-semibold text-lg text-indigo-700">{doc.originalName}</p>
                    <p className="text-sm text-gray-500">
                      Uploaded on: {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0 flex gap-3">
                    <a
  href={`https://docs.google.com/gview?url=${encodeURIComponent(doc.path)}&embedded=true`}
  target="_blank"
  rel="noopener noreferrer"
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
>
  👁️ Preview
</a>


                    <Link
                      to={`/sign/${doc._id}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                    >
                      ✍️ Sign
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Signature Requests */}
        <div>
          <h3 className="text-xl font-semibold mb-4">📨 Signature Requests</h3>

          {/* Incoming */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Incoming</h4>
            {requests.incoming.length === 0 ? (
              <p className="text-gray-500 text-sm">No incoming requests</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {requests.incoming.map((req) => (
                  <li key={req._id} className="bg-white p-3 border rounded shadow">
                    <div>
                      From: <strong>{req.sender?.name}</strong> – Document: <strong>{req.documentId?.originalName || 'Unknown'}</strong> – Status: <span className="text-blue-600 font-medium">{req.status}</span>
                      <Link
                        to={`/sign/${req.documentId?._id}`}
                        className="ml-2 text-green-700 hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Outgoing */}
          <div>
            <h4 className="font-medium mb-2">Outgoing</h4>
            {requests.outgoing.length === 0 ? (
              <p className="text-gray-500 text-sm">No outgoing requests</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {requests.outgoing.map((req) => (
                  <li key={req._id} className="bg-white p-3 border rounded shadow">
                    <div>
                      To: <strong>{req.recipient?.name}</strong> – Document: <strong>{req.documentId?.originalName || 'Unknown'}</strong> – Status: <span className="text-blue-600 font-medium">{req.status}</span>
                      <Link
                        to={`/sign/${req.documentId?._id}`}
                        className="ml-2 text-blue-700 hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
