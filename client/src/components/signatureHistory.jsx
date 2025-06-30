import React from "react";
import axiosInstance from "../utils/axiosInstance";

const SignatureHistory = ({ docId }) => {
  const [history, setHistory] = React.useState([]);

  React.useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get(`/signatures/${docId}`);
        setHistory(res.data);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      }
    };
    fetch();
  }, [docId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this signature?")) return;
    try {
      await axiosInstance.delete(`/signatures/${id}`);
      setHistory((prev) => prev.filter((sig) => sig._id !== id));
      alert("✅ Signature deleted");
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Failed to delete signature");
    }
  };

 return (
  <div className="mt-8 w-full max-w-xl">
    <h2 className="text-xl font-semibold mb-2">📜 Signature History</h2>

    {history.length === 0 ? (
      <p className="text-gray-500 italic">No signatures available.</p>
    ) : (
      history.map((sig) => (
        <div
          key={sig._id}
          className="bg-white p-3 mb-2 rounded shadow flex justify-between items-center"
        >
          <div>
            <p><strong>Text:</strong> {sig.text || "Signature"}</p>
            <p><strong>Page:</strong> {sig.page}</p>
            <p><strong>Position:</strong> (x: {Math.round(sig.x)}, y: {Math.round(sig.y)})</p>
            <p><strong>Color:</strong> <span style={{ color: sig.color }}>{sig.color}</span></p>
            <p><strong>Size:</strong> {sig.size}</p>
          </div>
          <button
            onClick={() => handleDelete(sig._id)}
            className="text-red-600 hover:text-red-800 font-semibold"
          >
            🗑️ Delete
          </button>
        </div>
      ))
    )}
  </div>
);
};

export default SignatureHistory;
