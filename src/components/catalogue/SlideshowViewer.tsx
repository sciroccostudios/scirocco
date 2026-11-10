import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, useMotionValue } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { DESERT_GRADIENT, LUXURY_EASING } from '@/lib/tokens';

const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 400;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.5;
/** Above this many slides, dots become unreadable, so show a progress bar instead. */
const MAX_DOTS = 10;

export interface SlideshowViewerProps {
  /** Number of slides. 0 renders the loading state. */
  count: number;
  /**
   * Renders one slide. `stage` is the measured stage box; size content in pixels
   * against it and multiply by `zoom` (1–3). Do NOT zoom with a CSS transform:
   * transforms don't affect layout, so the pan bounds below would measure the
   * unzoomed box and you'd be unable to reach the overflow.
   */
  renderSlide: (index: number, zoom: number, stage: { width: number; height: number }) => React.ReactNode;
  /** Caption under the stage. */
  label?: (index: number) => string;
  /** Shown top-right. */
  title: string;
  backUrl?: string;
  backLabel?: string;
  /** Extra controls in the bottom bar (download, inquire, …). */
  actions?: React.ReactNode;
  /** Replaces the stage while true. */
  isLoading?: boolean;
  loadingText?: string;
  /** Replaces the stage when set. */
  error?: React.ReactNode;
  onIndexChange?: (index: number) => void;
}

const SlideshowViewer: React.FC<SlideshowViewerProps> = ({
  count,
  renderSlide,
  label,
  title,
  backUrl = '/our-curations',
  backLabel = 'Back to Our Curations',
  actions,
  isLoading = false,
  loadingText = 'Loading…',
  error,
  onIndexChange,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [zoom, setZoom] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState({ width: 0, height: 0 });
  const [content, setContent] = useState({ width: 0, height: 0 });
  // Callback ref, not useRef: AnimatePresence mode="wait" mounts the next slide
  // ~450ms after the index changes, so an effect keyed on index would measure the
  // outgoing node. State-backed means we observe whichever node is actually live.
  const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null);

  // Pan offset lives in motion values so resetting can actually clear it;
  // framer-motion otherwise retains the dragged transform indefinitely.
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const resetPan = useCallback(() => { panX.set(0); panY.set(0); }, [panX, panY]);

  // Measure the stage so pixel-sized content (the PDF canvas) can fit itself.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setStage({ width: Math.round(width), height: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Measure the rendered slide so pan can be bounded to its actual overflow.
  useEffect(() => {
    if (!contentEl || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setContent({ width: Math.round(width), height: Math.round(height) });
    });
    ro.observe(contentEl);
    return () => ro.disconnect();
  }, [contentEl]);

  const isZoomed = zoom > 1;

  const goTo = useCallback((next: number, dir: number) => {
    if (count <= 0) return;
    const clamped = ((next % count) + count) % count;
    setDirection(dir);
    setZoom(1); // never carry zoom across slides; it strands you off-centre
    resetPan();
    setIndex(clamped);
    onIndexChange?.(clamped);
  }, [count, onIndexChange, resetPan]);

  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2))), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2))), []);
  const zoomReset = useCallback(() => { setZoom(1); resetPan(); }, [resetPan]);

  // Any route back to 1x (button, keyboard, stepping out) must also recentre.
  useEffect(() => {
    if (zoom === 1) resetPan();
  }, [zoom, resetPan]);

  // Pan is bounded to the slide's actual overflow, so it can never leave the stage.
  const overflowX = Math.max(0, (content.width - stage.width) / 2);
  const overflowY = Math.max(0, (content.height - stage.height) / 2);
  const panConstraints = { left: -overflowX, right: overflowX, top: -overflowY, bottom: overflowY };

  // Clamp if the slide count shrinks (e.g. a PDF reloads shorter)
  useEffect(() => {
    if (count > 0 && index >= count) setIndex(count - 1);
  }, [count, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      // Don't drive the carousel behind an open modal (e.g. the inquiry form)
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      switch (e.key) {
        case 'ArrowLeft': e.preventDefault(); prev(); break;
        case 'ArrowRight': e.preventDefault(); next(); break;
        case 'Home': e.preventDefault(); goTo(0, -1); break;
        case 'End': e.preventDefault(); goTo(count - 1, 1); break;
        case '+': case '=': e.preventDefault(); zoomIn(); break;
        case '-': case '_': e.preventDefault(); zoomOut(); break;
        case '0': e.preventDefault(); zoomReset(); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, goTo, count, zoomIn, zoomOut, zoomReset]);

  const slideVariants = {
    enter: (dir: number) => prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, x: dir > 0 ? 70 : -70 },
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, x: dir > 0 ? -70 : 70 },
  };

  const showDots = count > 1 && count <= MAX_DOTS;
  const showBar = count > MAX_DOTS;
  const counter = count > 0
    ? `${String(index + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`
    : '';

  return (
    <section
      className="relative w-full h-screen overflow-hidden text-scirocco-wheat flex flex-col"
      style={{ background: DESERT_GRADIENT, height: '100svh' }}
      aria-roledescription="carousel"
      aria-label={title}
    >
      {/* Grain, matching the site's other warm surfaces */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top bar: clears the fixed navbar */}
      <div className="relative z-20 flex items-center justify-between gap-3 px-3 sm:px-6 md:px-8 pt-20 md:pt-24 pb-2 md:pb-3">
        <a
          href={backUrl}
          className="inline-flex items-center gap-1.5 text-scirocco-desert hover:text-scirocco-wheat transition-colors font-lora text-xs sm:text-sm shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden xs:inline sm:inline">{backLabel}</span>
          <span className="xs:hidden sm:hidden">Back</span>
        </a>
        <h1 className="font-lora text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase text-scirocco-desert truncate">
          {title}
        </h1>
      </div>

      {/* Stage */}
      <div
        ref={stageRef}
        className="relative z-10 flex-1 min-h-0 flex items-center justify-center px-2 sm:px-10 md:px-16"
      >
        {count > 1 && (
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-0.5 sm:left-2 md:left-4 z-30 w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/15 hover:border-white/35 transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        )}

        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="text-center px-6">{error}</div>
          ) : isLoading || count === 0 ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-white/25 border-t-scirocco-desert animate-spin" />
              <p className="font-lora text-sm text-scirocco-desert">{loadingText}</p>
            </div>
          ) : (
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {/*
                Two elements on purpose. The outer one owns the enter/exit
                transition (which animates x); the inner one owns drag/pan (which
                also uses x). On a single element they'd overwrite each other.
              */}
              <motion.div
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, ease: LUXURY_EASING }}
                className="w-full h-full flex items-center justify-center"
              >
                <motion.div
                  ref={setContentEl}
                  // Unzoomed, dragging flips slides. Zoomed, it pans within bounds.
                  drag={isZoomed ? true : 'x'}
                  dragConstraints={isZoomed ? panConstraints : { left: 0, right: 0 }}
                  dragElastic={isZoomed ? 0 : 0.12}
                  dragMomentum={false}
                  style={{ x: panX, y: panY }}
                  onDragEnd={(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
                    if (isZoomed) return;
                    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) next();
                    else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) prev();
                  }}
                  className="flex items-center justify-center cursor-grab active:cursor-grabbing"
                >
                  {renderSlide(index, zoom, stage)}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {count > 1 && (
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-0.5 sm:right-2 md:right-4 z-30 w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/15 hover:border-white/35 transition-all duration-300"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        )}

        {/* Zoom cluster: vertical on desktop, tucked bottom-right on mobile */}
        <div className="absolute right-1 sm:right-2 md:right-4 bottom-1 sm:bottom-2 z-30 flex sm:flex-col items-center gap-1 sm:gap-1.5">
          <button
            type="button" onClick={zoomIn} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center bg-black/30 hover:bg-black/50 disabled:opacity-30 disabled:hover:bg-black/30 backdrop-blur-sm border border-white/15 transition-all"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button" onClick={zoomOut} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center bg-black/30 hover:bg-black/50 disabled:opacity-30 disabled:hover:bg-black/30 backdrop-blur-sm border border-white/15 transition-all"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button" onClick={zoomReset} disabled={zoom === 1} aria-label="Reset zoom"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center bg-black/30 hover:bg-black/50 disabled:opacity-30 disabled:hover:bg-black/30 backdrop-blur-sm border border-white/15 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Caption + controls */}
      <div className="relative z-20 px-4 md:px-8 pb-4 md:pb-7 pt-2 md:pt-4 text-center">
        {label && count > 0 && (
          <p
            aria-live="polite"
            className="font-playfair text-base sm:text-lg md:text-2xl text-scirocco-ivory mx-auto truncate"
          >
            {label(index)}
          </p>
        )}

        {counter && (
          <p className="font-lora text-[10px] sm:text-xs tracking-[0.3em] text-scirocco-desert mt-0.5 sm:mt-1 mx-auto">
            {counter}
          </p>
        )}

        {showDots && (
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 mt-2.5 sm:mt-4">
            {Array.from({ length: count }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i, i > index ? 1 : -1)}
                aria-label={label ? label(i) : `Slide ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-7 sm:w-8 bg-scirocco-desert' : 'w-1.5 bg-white/60 hover:bg-white/90'
                }`}
              />
            ))}
          </div>
        )}

        {showBar && (
          <div className="mx-auto mt-2.5 sm:mt-4 h-1 w-40 sm:w-64 rounded-full bg-white/15 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-scirocco-desert"
              animate={{ width: `${((index + 1) / count) * 100}%` }}
              transition={{ duration: 0.35, ease: LUXURY_EASING }}
            />
          </div>
        )}

        {actions && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-5">
            {actions}
          </div>
        )}
      </div>
    </section>
  );
};

export default SlideshowViewer;
