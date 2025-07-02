import React, { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import SignatureHistory from "../components/signatureHistory";
import SignatureToolbar from "../components/signToolbar";
import { Toaster, toast } from "react-hot-toast";
import Loader from "../components/Loader"; // ✅ Import your custom loader

// Worker setup
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
  const [loading, setLoading] = useState(true); // full-page loader
  const [saving, setSaving] = useState(false); // button loader
  const [downloading, setDownloading] = useState(false); // button loader

  const [signature, setSignature] = useState({
    text: "Kudhan",
    x: 50,
    y: 50,
    page: 1,
    color: "#000000",
    size: 20,
    style: "cursive",
  });

  const shownOnce = useRef(false);

  useEffect(() => {
    if (!shownOnce.current) {
      toast("⚠️ If PDF doesn't load, please reload the page.", {
        icon: "🌀",
        duration: 6000,
      });
      shownOnce.current = true;
    }
  }, []);

  // Load PDF
  useEffect(() => {
    const loadPDF = async () => {
      try {
        const res = await axiosInstance.get(`/docs/${docId}`);
        const fileUrl = res.data.path;
        const blob = await fetch(fileUrl).then((r) => r.blob());
        const arrayBuffer = await blob.arrayBuffer();
        const loadingTask = getDocument({ data: arrayBuffer });
        const loadedPdf = await loadingTask.promise;
        setPdf(loadedPdf);
      } catch (err) {
        console.error(err);
        toast.error("❌ PDF loading failed");
      } finally {
        setLoading(false);
      }
    };
    loadPDF();
  }, [docId]);

  // Render PDF
  useEffect(() => {
    if (!pdf) return;
    let renderTask = null;

    const render = async () => {
      const page = await pdf.getPage(signature.page);
      const vp = page.getViewport({ scale });
      setViewport(vp);

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.width = vp.width;
      canvas.height = vp.height;

      renderTask = page.render({ canvasContext: context, viewport: vp });
      await renderTask.promise;
    };

    render();
    return () => {
      if (renderTask && renderTask.cancel) renderTask.cancel();
    };
  }, [pdf, signature.page]);

  // Fetch saved signatures
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
    setSaving(true);
    try {
      if (!signature.text.trim()) {
        toast.error("Signature text cannot be empty");
        return;
      }

      await axiosInstance.post("/signatures", { ...signature, documentId: docId });
      toast.success("✅ Signature saved!");
      const res = await axiosInstance.get(`/signatures/${docId}`);
      setAllSignatures(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save signature");
    } finally {
      setSaving(false);
    }
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return rgb((bigint >> 16) / 255, ((bigint >> 8) & 255) / 255, (bigint & 255) / 255);
  };

  const getFont = async (doc, style) => {
    switch (style) {
      case "serif":
        return doc.embedFont(StandardFonts.TimesRoman);
      case "monospace":
      case "Courier":
        return doc.embedFont(StandardFonts.Courier);
      case "sans-serif":
      default:
        return doc.embedFont(StandardFonts.Helvetica);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await axiosInstance.get(`/docs/${docId}`);
      const fileUrl = res.data.path;
      const existingPdfBytes = await fetch(fileUrl).then((r) => r.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      const pages = pdfDoc.getPages();
      const page = pages[signature.page - 1];

      const pdfWidth = page.getWidth();
      const pdfHeight = page.getHeight();

      const canvas = canvasRef.current;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const scaleX = pdfWidth / canvasWidth;
      const scaleY = pdfHeight / canvasHeight;

      const font = await getFont(pdfDoc, signature.style || "Helvetica");
      const x = signature.x * scaleX;
      const y = pdfHeight - signature.y * scaleY - signature.size * scaleY;

      page.drawText(signature.text || "Signature", {
        x,
        y,
        size: signature.size * scaleX,
        font,
        color: hexToRgb(signature.color || "#000000"),
      });

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
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <Loader />;

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

        {/* Sidebar Tools */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
          <SignatureToolbar signature={signature} setSignature={setSignature} />

          <button
            onClick={handleSave}
            disabled={saving}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow flex items-center justify-center ${
              saving ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {saving ? "Saving..." : "💾 Save Signature"}
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow flex items-center justify-center ${
              downloading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {downloading ? "Downloading..." : "📥 Download Signed PDF"}
          </button>

          <SignatureHistory docId={docId} />
        </div>
      </div>

      <Toaster position="top-center" />
    </div>
  );
};

export default SignPDFPage;
