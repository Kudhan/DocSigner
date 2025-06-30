// ✅ SignatureToolbar - Beautified
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const SignatureToolbar = ({ signature, setSignature }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="mt-4 p-5 bg-white rounded-xl shadow flex flex-col gap-4 border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-700">✒️ Customize Your Signature</h3>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:underline"
        >
          🔓 Sign Out
        </button>
      </div>

      {/* Signature Text */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Signature Text</label>
        <input
          type="text"
          value={signature.text}
          onChange={(e) => setSignature({ ...signature, text: e.target.value })}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="e.g., Kudhan"
        />
      </div>

      {/* Font Style */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Font Style</label>
        <select
          value={signature.style}
          onChange={(e) => setSignature({ ...signature, style: e.target.value })}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="cursive">Cursive</option>
          <option value="serif">Serif</option>
          <option value="sans-serif">Sans-serif</option>
          <option value="monospace">Monospace</option>
          <option value="Courier">Courier</option>
        </select>
      </div>

      {/* Signature Color */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-600">Color:</label>
        <input
          type="color"
          value={signature.color}
          onChange={(e) => setSignature({ ...signature, color: e.target.value })}
          className="w-10 h-10 rounded border"
        />
      </div>

      {/* Signature Size */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Size: {signature.size}</label>
        <input
          type="range"
          min="10"
          max="60"
          value={signature.size}
          onChange={(e) => setSignature({ ...signature, size: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Request Links */}
      <div className="mt-6 space-y-2">
        <Link
          to="/request-signature"
          className="block text-center text-blue-600 hover:underline text-sm"
        >
          ➕ Request Signature
        </Link>
        <Link
          to="/incoming-requests"
          className="block text-center text-purple-600 hover:underline text-sm"
        >
          📥 Incoming Requests
        </Link>
        <Link
          to="/outgoing-requests"
          className="block text-center text-green-600 hover:underline text-sm"
        >
          📤 Outgoing Requests
        </Link>
      </div>
    </div>
  );
};

export default SignatureToolbar;
