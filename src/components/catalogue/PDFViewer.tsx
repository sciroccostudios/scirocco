import React, { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Download } from 'lucide-react';
import SlideshowViewer from './SlideshowViewer';

// Self-hosted worker. A cross-origin workerSrc is fetched and re-executed as a
// same-origin blob by pdf.js, so a CDN copy would run unverifiable third-party
// code on our origin and make the catalogue depend on that CDN staying up.
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

interface PDFViewerProps {
  pdfUrl: string;
  title?: string;
  downloadFilename?: string;
  backUrl?: string;
  backLabel?: string;
}

/** Fallback until the first page reports its real dimensions (A4 portrait). */
const DEFAULT_ASPECT = 210 / 297;

/**
 * PDFViewer: one page at a time in the shared fullscreen slideshow.
 *
 * Pages are re-rendered at native scale rather than CSS-transformed, so text
 * stays vector-sharp when zoomed.
 */
const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfUrl,
  title = 'The Scirocco Edit',
  downloadFilename,
  backUrl = '/our-curations',
  backLabel = 'Back to Our Curations',
}) => {
  const [numPages, setNumPages] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [aspect, setAspect] = useState(DEFAULT_ASPECT);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoadError(false);
  }, []);

  const onDocumentLoadError = useCallback(() => setLoadError(true), []);

  // First page to load defines the fit ratio for the rest.
  const onPageLoadSuccess = useCallback((page: { width: number; height: number }) => {
    if (page?.width && page?.height) setAspect(page.width / page.height);
  }, []);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = downloadFilename || pdfUrl.split('/').pop() || 'scirocco-catalogue.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const errorNode = loadError ? (
    <div className="flex flex-col items-center gap-4">
      <h2 className="font-playfair text-xl text-scirocco-ivory">Unable to load this catalogue</h2>
      <p className="font-lora text-sm text-scirocco-ivory max-w-md">
        Please download it to view offline.
      </p>
      <button
        onClick={handleDownload}
        className="mt-1 inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/25 hover:border-white/50 hover:bg-white/10 font-lora text-sm transition-all duration-300"
      >
        <Download className="w-4 h-4" />
        <span>Download PDF</span>
      </button>
    </div>
  ) : undefined;

  return (
    // display:contents so react-pdf's wrapper doesn't disturb the viewer's layout
    <Document
      file={pdfUrl}
      onLoadSuccess={onDocumentLoadSuccess}
      onLoadError={onDocumentLoadError}
      loading={null}
      error={null}
      noData={null}
      className="contents"
    >
      <SlideshowViewer
        title={title}
        count={loadError ? 1 : numPages}
        backUrl={backUrl}
        backLabel={backLabel}
        error={errorNode}
        loadingText="Loading catalogue…"
        label={(i) => `Page ${i + 1}`}
        renderSlide={(i, zoom, stage) => {
          // Contain the page in the stage, then multiply by zoom.
          const fitByWidth = stage.width > 0 && aspect > stage.width / stage.height;
          const width = fitByWidth ? Math.round(stage.width * zoom) : undefined;
          const height = !fitByWidth && stage.height > 0
            ? Math.round(stage.height * zoom)
            : undefined;

          return (
            <Page
              pageNumber={i + 1}
              width={width}
              height={height}
              onLoadSuccess={onPageLoadSuccess}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              // bg-white: PDF canvases are transparent, so without it the brown
              // backdrop bleeds through and washes out every page.
              className="[&_canvas]:rounded-lg [&_canvas]:bg-white [&_canvas]:shadow-[0_30px_90px_rgba(0,0,0,0.45)] [&_canvas]:max-w-none"
              loading={
                <div className="w-8 h-8 rounded-full border-2 border-white/25 border-t-scirocco-desert animate-spin" />
              }
            />
          );
        }}
        actions={
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full border border-white/25 hover:border-white/50 hover:bg-white/10 backdrop-blur-sm font-lora text-xs sm:text-sm tracking-wide transition-all duration-300"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        }
      />
    </Document>
  );
};

export default PDFViewer;
