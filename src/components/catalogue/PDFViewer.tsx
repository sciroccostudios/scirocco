import React, { useState, useCallback, useMemo } from 'react';
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
  /** File size in bytes. When given, the PDF is loaded in byte ranges (see below). */
  pdfSize?: number;
  title?: string;
  downloadFilename?: string;
  backUrl?: string;
  backLabel?: string;
}

/** Fallback until the first page reports its real dimensions (A4 portrait). */
const DEFAULT_ASPECT = 210 / 297;

/**
 * Fetch only the byte ranges each page needs instead of streaming the whole
 * file first, so page 1 shows quickly on slow connections. Stable reference:
 * react-pdf reloads the document if `options` changes identity.
 */
const PDF_OPTIONS = { disableAutoFetch: true, disableStream: true };

/**
 * Loads the PDF through our own range requests.
 *
 * Netlify brotli-compresses full PDF responses, and pdf.js turns range loading
 * off for any compressed response, so it would download the whole file before
 * showing page 1. Range responses come back uncompressed, so requesting them
 * directly lets page 1 appear after only the bytes it needs.
 */
function createRangeSource(url: string, length: number, onFail: () => void) {
  const transport = new pdfjs.PDFDataRangeTransport(length, null);
  let failed = false;
  transport.requestDataRange = (begin: number, end: number) => {
    fetch(url, { headers: { Range: `bytes=${begin}-${end - 1}` } })
      .then((res) => {
        if (res.status !== 206) throw new Error(`Range request returned ${res.status}`);
        return res.arrayBuffer();
      })
      .then((buf) => transport.onDataRange(begin, new Uint8Array(buf)))
      .catch((err) => {
        if (failed) return;
        failed = true;
        console.warn('PDF range loading failed; downloading the whole file instead.', err);
        onFail();
      });
  };
  return { range: transport };
}

/**
 * PDFViewer: one page at a time in the shared fullscreen slideshow.
 *
 * Pages are re-rendered at native scale rather than CSS-transformed, so text
 * stays vector-sharp when zoomed.
 */
const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfUrl,
  pdfSize,
  title = 'The Scirocco Edit',
  downloadFilename,
  backUrl = '/our-curations',
  backLabel = 'Back to Our Curations',
}) => {
  const [numPages, setNumPages] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [aspect, setAspect] = useState(DEFAULT_ASPECT);
  const [rangesFailed, setRangesFailed] = useState(false);
  const file = useMemo(
    () => (pdfSize && !rangesFailed
      ? createRangeSource(pdfUrl, pdfSize, () => setRangesFailed(true))
      : pdfUrl),
    [pdfUrl, pdfSize, rangesFailed],
  );
  // Pages that have painted at least once. Until then the canvas is blank, so
  // it gets no corners or shadow and the site background shows through.
  const [rendered, setRendered] = useState<ReadonlySet<number>>(() => new Set());

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

  const markRendered = useCallback((i: number) => {
    setRendered((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
  }, []);

  const errorNode = (
    <div className="flex flex-col items-center gap-4">
      <h2 className="font-playfair text-xl text-scirocco-wheat">Unable to load this catalogue</h2>
      <p className="font-lora text-sm text-scirocco-wheat max-w-md">
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
  );

  const downloadButton = (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full border border-white/25 hover:border-white/50 hover:bg-white/10 backdrop-blur-sm font-lora text-xs sm:text-sm tracking-wide transition-all duration-300"
    >
      <Download className="w-3.5 h-3.5" />
      <span>Download PDF</span>
    </button>
  );

  const shellProps = {
    title,
    backUrl,
    backLabel,
    loadingText: 'Loading catalogue…',
    actions: downloadButton,
  };

  // react-pdf only renders Document's children once the file has loaded, so
  // the same viewer shell (with count 0) stands in until then. Without it the
  // screen stays blank while the PDF downloads.
  const loadingShell = <SlideshowViewer {...shellProps} count={0} renderSlide={() => null} />;

  return (
    // display:contents so react-pdf's wrapper doesn't disturb the viewer's layout
    <Document
      file={file}
      options={PDF_OPTIONS}
      onLoadSuccess={onDocumentLoadSuccess}
      onLoadError={onDocumentLoadError}
      loading={loadingShell}
      error={<SlideshowViewer {...shellProps} count={1} error={errorNode} renderSlide={() => null} />}
      noData={loadingShell}
      className="contents"
    >
      <SlideshowViewer
        {...shellProps}
        count={loadError ? 1 : numPages}
        error={loadError ? errorNode : undefined}
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
              onRenderSuccess={() => markRendered(i)}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              // !bg-transparent overrides react-pdf's inline white wrapper,
              // which otherwise flashes before render and shows at the corners.
              className={`!bg-transparent [&_canvas]:max-w-none ${
                rendered.has(i)
                  ? '[&_canvas]:rounded-lg [&_canvas]:shadow-[0_30px_90px_rgba(0,0,0,0.45)]'
                  : ''
              }`}
              loading={
                <div className="w-8 h-8 rounded-full border-2 border-white/25 border-t-scirocco-desert animate-spin" />
              }
            />
          );
        }}
      />
    </Document>
  );
};

export default PDFViewer;
