// client/src/components/SignatureToolbar.jsx
import React from "react";

const SignatureToolbar = ({ signature, setSignature }) => {
  return (
    <div className="mt-6 flex flex-col gap-2 w-96 bg-white shadow p-4 rounded">
      <label className="text-sm font-medium">Color:</label>
      <input
        type="color"
        value={signature.color}
        onChange={(e) => setSignature({ ...signature, color: e.target.value })}
        className="w-20 h-8 border"
      />

      <label className="text-sm font-medium">Size:</label>
      <input
        type="range"
        min="10"
        max="48"
        value={signature.size}
        onChange={(e) => setSignature({ ...signature, size: parseInt(e.target.value) })}
        className="w-full"
      />

      <label className="text-sm font-medium">Style:</label>
      <select
        value={signature.style}
        onChange={(e) => setSignature({ ...signature, style: e.target.value })}
        className="border px-2 py-1 rounded"
      >
        <option value="cursive">Cursive</option>
        <option value="monospace">Monospace</option>
        <option value="serif">Serif</option>
        <option value="sans-serif">Sans-Serif</option>
      </select>
    </div>
  );
};

export default SignatureToolbar;
