import React, { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import SignatureToolbar from "../components/SignatureToolbar";

// ✅ Setup PDF.js worker (Vite-compatible)
GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const SignPDFPage = () => {
  const { docId } = useParams();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [pdf, setPdf] = useState(null);
  const [signature, setSignature] = useState({
    x: 50,
    y: 50,
    page: 1,
    color: "#000000",
    size: 20,
    style: "cursive",
  });

  // ✅ Load PDF file
  useEffect(() => {
    const loadPDF = async () => {
      try {
        const res = await axiosInstance.get(`/docs/${docId}`);
        const fileUrl = `http://localhost:5000/${res.data.path.replace(/\\/g, "/")}`;

        const blobRes = await fetch(fileUrl);
        const blob = await blobRes.blob();
        const arrayBuffer = await blob.arrayBuffer();

        const loadingTask = getDocument({ data: arrayBuffer });
        const loadedPdf = await loadingTask.promise;
        setPdf(loadedPdf);
      } catch (err) {
        console.error("❌ Failed to load PDF:", err);
        alert("❌ PDF loading failed. Check console.");
      }
    };

    loadPDF();
  }, [docId]);

  // ✅ Render PDF page
  useEffect(() => {
    if (!pdf) return;

    pdf.getPage(signature.page).then((page) => {
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      page.render({ canvasContext: context, viewport });
    });
  }, [pdf, signature.page]);

  // ✅ Drag to move signature
  const handleMouseDown = (e) => {
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const initX = signature.x;
    const initY = signature.y;

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      const canvas = canvasRef.current;
      const newX = Math.max(0, Math.min(initX + dx, canvas.width - 100)); // assuming signature is ~100px
      const newY = Math.max(0, Math.min(initY + dy, canvas.height - 40)); // assuming ~40px

      setSignature((prev) => ({
        ...prev,
        x: newX,
        y: newY,
      }));
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // ✅ Save signature
  const handleSave = async () => {
    try {
      await axiosInstance.post("/signatures", {
        ...signature,
        documentId: docId,
      });
      alert("✅ Signature saved!");
    } catch (err) {
      console.error("❌ Failed to save signature:", err);
      alert("❌ Could not save signature");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">📄 Place Your Signature</h1>

      <div ref={containerRef} className="relative border shadow rounded overflow-hidden">
        <canvas ref={canvasRef} />

        {/* ✒️ Signature Overlay */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: "absolute",
            top: signature.y,
            left: signature.x,
            fontSize: `${signature.size}px`,
            fontFamily: signature.style,
            color: signature.color,
            cursor: "grab",
            userSelect: "none",
          }}
        >
          ✒️ Signature
        </div>
      </div>

      {/* Signature controls */}
      <SignatureToolbar signature={signature} setSignature={setSignature} />

      <button
        onClick={handleSave}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
      >
        💾 Save Signature
      </button>
    </div>
  );
};

export default SignPDFPage;
