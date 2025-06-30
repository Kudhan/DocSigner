// ✅ Polished SignPDFPage.jsx (UI Only)
import React, { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import SignatureToolbar from "../components/SignatureToolbar";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import SignatureHistory from "../components/signatureHistory";
import SignatureToolbar from "../components/signToolbar";
import { Toaster, toast } from "react-hot-toast";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();




const SignPDFPage = () => {
  const { docId } = useParams();
  const canvasRef = useRef(null);
  const [pdf, setPdf] = useState(null);
  const [viewport, setViewport] = useState(null);
  const [scale] = useState(1.5);
  const [allSignatures, setAllSignatures] = useState([]);
  const [signature, setSignature] = useState({
    text: "Kudhan",
    x: 50,
    y: 50,
    page: 1,
    color: "#000000",
    size: 20,
    style: "cursive",
  });

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const res = await axiosInstance.get(`/docs/${docId}`);
        const fileUrl = `http://localhost:5000/${res.data.path.replace(/\\/g, "/")}`;
        const blob = await fetch(fileUrl).then((r) => r.blob());
        const arrayBuffer = await blob.arrayBuffer();
        const loadingTask = getDocument({ data: arrayBuffer });
        const loadedPdf = await loadingTask.promise;
        setPdf(loadedPdf);
      } catch (err) {
        console.error(err);
        alert("PDF loading failed");
      }
    };
    loadPDF();
  }, [docId]);

  useEffect(() => {
    if (!pdf) return;
    const render = async () => {
      const page = await pdf.getPage(signature.page);
      const vp = page.getViewport({ scale });
      setViewport(vp);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.width = vp.width;
      canvas.height = vp.height;
      await page.render({ canvasContext: context, viewport: vp }).promise;
    };
    render();
  }, [pdf, signature.page, scale]);


 const shownOnce = useRef(false); // 👈 flag

  useEffect(() => {
    if (!shownOnce.current) {
      toast("⚠️ If PDF doesn't load, please reload the page.", {
        icon: "🌀",
        duration: 6000,
      });
      shownOnce.current = true;
    }
  }, []);


  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        const res = await axiosInstance.get(`/signatures/${docId}`);
        setAllSignatures(res.data);
      } catch (err) {
        console.error("Error fetching signatures:", err);
      }
    };
    if (pdf) fetchSignatures();
  }, [pdf, docId]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const initX = signature.x;
    const initY = signature.y;
    const move = (mv) => {
      const dx = mv.clientX - startX;
      const dy = mv.clientY - startY;
      const canvas = canvasRef.current;
      const newX = Math.max(0, Math.min(initX + dx, canvas.width - 100));
      const newY = Math.max(0, Math.min(initY + dy, canvas.height - 40));
      setSignature((prev) => ({ ...prev, x: newX, y: newY }));
    };
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  const handleSave = async () => {
    try {
      await axiosInstance.post("/signatures", { ...signature, documentId: docId });
      toast.success("✅ Signature saved successfully!");

    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save signature");
    }
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return rgb((bigint >> 16) / 255, ((bigint >> 8) & 255) / 255, (bigint & 255) / 255);
  };

  const getFont = async (doc, style) => {
    switch (style) {
      case "serif": return doc.embedFont(StandardFonts.TimesRoman);
      case "monospace": return doc.embedFont(StandardFonts.Courier);
      default: return doc.embedFont(StandardFonts.Helvetica);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await axiosInstance.get(`/docs/${docId}`);
      const fileUrl = `http://localhost:5000/${res.data.path.replace(/\\/g, "/")}`;
      const existingPdfBytes = await fetch(fileUrl).then((r) => r.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const pdfWidth = pages[0].getWidth();
      const pdfHeight = pages[0].getHeight();
      const canvasWidth = viewport.width;
      const canvasHeight = viewport.height;
      const scaleX = pdfWidth / canvasWidth;
      const scaleY = pdfHeight / canvasHeight;

      for (const sig of allSignatures) {
        const page = pages[sig.page - 1];
        const font = await getFont(pdfDoc, sig.style);
        const x = sig.x * scaleX;
        const y = pdfHeight - sig.y * scaleY - sig.size * scaleY;
        page.drawText(sig.text || "Signature", {
          x,
          y,
          size: sig.size * scaleX,
          font,
          color: hexToRgb(sig.color),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "signed-document.pdf";
      link.click();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to download signed PDF");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">✍️ Sign Document</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* PDF Viewer */}
        <div className="relative bg-white border rounded shadow overflow-hidden mx-auto">
          <canvas ref={canvasRef} />
          {viewport && (
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
                zIndex: 10,
              }}
            >
              {signature.text}
            </div>
          )}
        </div>

        {/* Sidebar Controls */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
          <SignatureToolbar signature={signature} setSignature={setSignature} />

          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            💾 Save Signature
          </button>

          <button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            📥 Download Signed PDF
          </button>

          <div className="mt-4">
            <SignatureHistory docId={docId} />
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default SignPDFPage;
