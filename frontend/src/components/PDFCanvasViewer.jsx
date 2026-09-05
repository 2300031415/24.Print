import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const PDFCanvasViewer = ({ fileUrl, totalPages: propTotalPages, onPageChange }) => {
  const canvasRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(propTotalPages || 1);
  const [scale, setScale] = useState(1.2);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Load PDF Document
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setLoadError(false);

    const loadingTask = pdfjsLib.getDocument(fileUrl);
    loadingTask.promise.then(
      (pdf) => {
        if (!isMounted) return;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading PDF canvas:', error);
        if (isMounted) {
          setLoadError(true);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [fileUrl]);

  // Render Page to Canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || loadError) return;

    let renderTask = null;

    pdfDoc.getPage(currentPage).then((page) => {
      const viewport = page.getViewport({ scale, rotation });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      renderTask = page.render(renderContext);
    }).catch(err => {
      console.warn('Canvas render page error:', err);
    });

    return () => {
      if (renderTask) renderTask.cancel();
    };
  }, [pdfDoc, currentPage, scale, rotation, loadError]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (onPageChange) onPageChange(newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (onPageChange) onPageChange(newPage);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 2.5));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.75));

  return (
    <div className="flex flex-col items-center w-full h-full bg-white rounded-3xl border-2 border-blue-100 p-4 shadow-xl select-none font-sans">
      {/* Touch Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full bg-blue-50/80 rounded-2xl p-3 mb-3 border border-blue-200">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="p-3 bg-white hover:bg-blue-100 active:scale-95 disabled:opacity-40 text-blue-900 font-bold rounded-xl transition-all shadow-sm border border-blue-200"
            title="Previous Page"
          >
            <ChevronLeft className="w-5 h-5 text-blue-600" />
          </button>

          <span className="text-sm font-black text-slate-950 px-3 py-1.5 bg-white rounded-xl border border-blue-200 font-mono">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="p-3 bg-white hover:bg-blue-100 active:scale-95 disabled:opacity-40 text-blue-900 font-bold rounded-xl transition-all shadow-sm border border-blue-200"
            title="Next Page"
          >
            <ChevronRight className="w-5 h-5 text-blue-600" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-3 bg-white hover:bg-blue-100 active:scale-95 text-blue-900 font-bold rounded-xl transition-all shadow-sm border border-blue-200"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5 text-blue-600" />
          </button>

          <span className="text-xs font-black text-blue-600 px-3 py-1.5 bg-blue-100/80 rounded-xl border border-blue-300 font-mono">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            className="p-3 bg-white hover:bg-blue-100 active:scale-95 text-blue-900 font-bold rounded-xl transition-all shadow-sm border border-blue-200"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5 text-blue-600" />
          </button>

          <div className="h-6 w-px bg-blue-200 mx-1"></div>

          <button
            onClick={handleRotate}
            className="p-3 bg-[#0066FF] hover:bg-[#0052CC] active:scale-95 text-white font-extrabold rounded-xl transition-all flex items-center gap-1.5 text-xs shadow-md"
            title="Rotate 90°"
          >
            <RotateCw className="w-4 h-4" />
            <span>Rotate</span>
          </button>
        </div>
      </div>

      {/* PDF Viewport Canvas */}
      <div className="relative flex-1 w-full overflow-auto flex items-center justify-center bg-slate-100/60 rounded-2xl border border-blue-100 p-4 min-h-[420px]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-10 rounded-2xl">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
            <p className="text-sm font-bold text-slate-700">Rendering Document Preview...</p>
          </div>
        )}

        {loadError ? (
          <iframe
            src={`${fileUrl}#toolbar=0&navpanes=0`}
            className="w-full h-full min-h-[450px] rounded-xl border-0 bg-white"
            title="PDF Document Preview"
          />
        ) : (
          <canvas ref={canvasRef} className="max-w-full shadow-xl rounded-xl border border-slate-200" />
        )}
      </div>
    </div>
  );
};

export default PDFCanvasViewer;
