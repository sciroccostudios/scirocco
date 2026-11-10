import React, { useState, useCallback, useEffect, memo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';

const GEO_URL = '/data/countries-110m.json';

const DEFAULT_CENTER: [number, number] = [10, 20];
const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 1;
const MAX_ZOOM = 6;
const ZOOM_STEP = 1.5;

// 19 highlighted countries: ISO 3166-1 numeric IDs
const HIGHLIGHTED_COUNTRY_IDS = new Set([
  '840', // USA
  '784', // UAE
  '250', // France
  '616', // Poland
  '764', // Thailand
  '620', // Portugal
  '076', // Brazil
  '724', // Spain
  '422', // Lebanon
  '528', // Netherlands
  '056', // Belgium
  '276', // Germany
  '792', // Turkey
  '566', // Nigeria
  '484', // Mexico
  '356', // India
  '826', // United Kingdom
  '642', // Romania
  '156', // China
]);

const COUNTRY_NAMES: Record<string, string> = {
  '840': 'United States',
  '784': 'United Arab Emirates',
  '250': 'France',
  '616': 'Poland',
  '764': 'Thailand',
  '620': 'Portugal',
  '076': 'Brazil',
  '724': 'Spain',
  '422': 'Lebanon',
  '528': 'Netherlands',
  '056': 'Belgium',
  '276': 'Germany',
  '792': 'Turkey',
  '566': 'Nigeria',
  '484': 'Mexico',
  '356': 'India',
  '826': 'United Kingdom',
  '642': 'Romania',
  '156': 'China',
};

const COLORS = {
  highlightedFill: '#D4A574',
  highlightedHover: '#E8C9A8',
  highlightedStroke: '#A87F66',
  defaultFill: '#7A4E3D',
  defaultStroke: '#5C2F18',
};

const highlightedStyle = {
  default: { fill: COLORS.highlightedFill, stroke: COLORS.highlightedStroke, strokeWidth: 0.75, outline: 'none' },
  hover: { fill: COLORS.highlightedHover, stroke: COLORS.highlightedStroke, strokeWidth: 0.75, outline: 'none', cursor: 'pointer' },
  pressed: { fill: COLORS.highlightedHover, stroke: COLORS.highlightedStroke, strokeWidth: 0.75, outline: 'none' },
};

const defaultStyle = {
  default: { fill: COLORS.defaultFill, stroke: COLORS.defaultStroke, strokeWidth: 0.3, outline: 'none' },
  hover: { fill: COLORS.defaultFill, stroke: COLORS.defaultStroke, strokeWidth: 0.3, outline: 'none', cursor: 'default' },
  pressed: { fill: COLORS.defaultFill, stroke: COLORS.defaultStroke, strokeWidth: 0.3, outline: 'none' },
};

// Stable filter: allows trackpad pinch (wheel+ctrlKey), blocks right-click
function filterZoomEvent(evt: any): boolean {
  return (!evt.ctrlKey || evt.type === 'wheel') && !evt.button;
}

interface CountryShapeProps {
  geo: any;
  isHighlighted: boolean;
  isTouchDevice: boolean;
  onMouseEnter: (geo: any) => void;
  onMouseMove: (evt: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onClick: (geo: any, evt: React.MouseEvent) => void;
}

const CountryShape = memo(({ geo, isHighlighted, isTouchDevice, onMouseEnter, onMouseMove, onMouseLeave, onClick }: CountryShapeProps) => (
  <Geography
    geography={geo}
    style={isHighlighted ? highlightedStyle : defaultStyle}
    onMouseEnter={!isTouchDevice && isHighlighted ? () => onMouseEnter(geo) : undefined}
    onMouseMove={!isTouchDevice && isHighlighted ? onMouseMove : undefined}
    onMouseLeave={!isTouchDevice && isHighlighted ? onMouseLeave : undefined}
    onClick={(evt: React.MouseEvent) => onClick(geo, evt)}
  />
));

CountryShape.displayName = 'CountryShape';

// Zoom control button
const ZoomButton = ({ label, onClick, title }: { label: string; onClick: () => void; title: string }) => (
  <button
    onClick={onClick}
    type="button"
    title={title}
    aria-label={title}
    className="flex items-center justify-center w-9 h-9 rounded-lg text-base font-lora transition-all duration-200 select-none"
    style={{
      background: 'rgba(74, 37, 17, 0.85)',
      border: '1px solid rgba(212, 165, 116, 0.3)',
      color: '#D4A574',
      backdropFilter: 'blur(8px)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'rgba(212, 165, 116, 0.6)';
      e.currentTarget.style.background = 'rgba(74, 37, 17, 0.95)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'rgba(212, 165, 116, 0.3)';
      e.currentTarget.style.background = 'rgba(74, 37, 17, 0.85)';
    }}
  >
    <span aria-hidden="true">{label}</span>
  </button>
);

const WorldMap: React.FC = () => {
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device and set portrait-optimized defaults
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);

    // Portrait no longer starts zoomed in; always start fully zoomed out
  }, []);

  // Sync state after user pan/zoom interaction
  const handleMoveEnd = useCallback(({ coordinates, zoom: z }: { coordinates: [number, number]; zoom: number }) => {
    setCenter(coordinates);
    setZoom(z);
  }, []);

  // Desktop: hover handlers
  const handleMouseEnter = useCallback((geo: any) => {
    setTooltipContent(COUNTRY_NAMES[geo.id] || geo.properties.name);
  }, []);

  const handleMouseMove = useCallback((evt: React.MouseEvent) => {
    setTooltipPos({ x: evt.clientX, y: evt.clientY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltipContent(null);
  }, []);

  // Click handler: handles both touch tap (persistent tooltip) and background dismiss
  const handleCountryClick = useCallback((geo: any, evt: React.MouseEvent) => {
    const isHighlighted = HIGHLIGHTED_COUNTRY_IDS.has(geo.id);
    if (isHighlighted) {
      evt.stopPropagation();
      setTooltipContent(COUNTRY_NAMES[geo.id] || geo.properties.name);
    } else if (isTouchDevice) {
      setTooltipContent(null);
    }
  }, [isTouchDevice]);

  // Dismiss tooltip when tapping map background (touch only)
  const handleBackgroundClick = useCallback(() => {
    if (isTouchDevice) {
      setTooltipContent(null);
    }
  }, [isTouchDevice]);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z * ZOOM_STEP, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(z / ZOOM_STEP, MIN_ZOOM));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(MIN_ZOOM);
    setCenter(DEFAULT_CENTER);
  }, []);

  return (
    <section
      className="relative flex flex-col"
      style={{
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        minHeight: '85vh',
        background: 'linear-gradient(180deg, #5C2F18 0%, #4A2511 50%, #3D1E0D 100%)',
      }}
    >
      {/* Header */}
      <motion.div
        className="text-center pt-16 pb-6 px-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.19, 1.0, 0.22, 1.0] }}
      >
        <span
          className="font-lora text-xs tracking-[0.3em] uppercase block"
          style={{ color: '#D4A574' }}
        >
          Global Network
        </span>
        <h2
          className="font-playfair text-3xl md:text-4xl lg:text-5xl mt-4"
          style={{ color: '#F5DEB3', lineHeight: 1.2 }}
        >
          Curating Excellence Across Continents
        </h2>
        <p
          className="font-baskerville text-sm md:text-base mt-4 max-w-xl mx-auto"
          style={{ color: '#AF8774', lineHeight: 1.6 }}
        >
          From the ateliers of Italy to the workshops of Asia, we bridge the gap between vision and reality, sourcing the finest materials for your masterpiece.
        </p>
      </motion.div>

      {/* Map */}
      <div
        className="flex-1 relative w-full flex items-center justify-center px-4 md:px-8 pb-8"
        style={{ contain: 'layout style paint', willChange: 'transform', minHeight: '50vh', touchAction: 'pan-y' }}
        onClick={handleBackgroundClick}
      >
        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{
            scale: 160,
            center: [10, 20],
          }}
          width={980}
          height={500}
          style={{ width: '100%', height: '100%', maxHeight: '65vh', touchAction: 'none' }}
        >
          <ZoomableGroup
            center={center}
            zoom={zoom}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            onMoveEnd={handleMoveEnd}
            filterZoomEvent={filterZoomEvent}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isHighlighted = HIGHLIGHTED_COUNTRY_IDS.has(geo.id);
                  return (
                    <CountryShape
                      key={geo.rsmKey}
                      geo={geo}
                      isHighlighted={isHighlighted}
                      isTouchDevice={isTouchDevice}
                      onMouseEnter={handleMouseEnter}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      onClick={handleCountryClick}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Zoom Controls */}
        <div className="absolute bottom-12 right-4 md:right-10 flex flex-col gap-1.5 z-10">
          <ZoomButton label="+" onClick={handleZoomIn} title="Zoom in" />
          <ZoomButton label="−" onClick={handleZoomOut} title="Zoom out" />
          <ZoomButton label="⟲" onClick={handleZoomReset} title="Reset view" />
        </div>

        {/* Mobile Tooltip: persistent pill at bottom center */}
        <AnimatePresence>
          {isTouchDevice && tooltipContent && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 px-5 py-2.5 rounded-full font-lora text-sm tracking-wide whitespace-nowrap"
              style={{
                backgroundColor: 'rgba(74, 37, 17, 0.95)',
                border: '1px solid rgba(212, 165, 116, 0.4)',
                color: '#D4A574',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              }}
            >
              {tooltipContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats */}
      <motion.div
        className="flex justify-center items-stretch gap-2 sm:gap-6 pb-12 px-3 sm:px-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.19, 1.0, 0.22, 1.0] }}
      >
        <div
          className="flex-1 min-w-0 sm:flex-none text-center rounded-xl px-2 py-4 sm:px-9 sm:py-5 transition-all duration-300 hover:-translate-y-1"
          style={{
            background: 'rgba(92,47,24,0.3)',
            border: '1px solid rgba(212,165,116,0.15)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(212,165,116,0.4)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(212,165,116,0.15)')}
        >
          <span className="block font-playfair text-2xl sm:text-3xl italic" style={{ color: '#D4A574' }}>19</span>
          <span className="block text-[9px] sm:text-[10px] tracking-[1px] sm:tracking-[2px] uppercase mt-1.5 whitespace-nowrap" style={{ color: '#AF8774' }}>Countries</span>
        </div>
        <div
          className="flex-1 min-w-0 sm:flex-none text-center rounded-xl px-2 py-4 sm:px-9 sm:py-5 transition-all duration-300 hover:-translate-y-1"
          style={{
            background: 'rgba(92,47,24,0.3)',
            border: '1px solid rgba(212,165,116,0.15)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(212,165,116,0.4)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(212,165,116,0.15)')}
        >
          <span className="block font-playfair text-2xl sm:text-3xl italic" style={{ color: '#D4A574' }}>200+</span>
          <span className="block text-[9px] sm:text-[10px] tracking-[1px] sm:tracking-[2px] uppercase mt-1.5 whitespace-nowrap" style={{ color: '#AF8774' }}>Partner Brands</span>
        </div>
        <div
          className="flex-1 min-w-0 sm:flex-none text-center rounded-xl px-2 py-4 sm:px-9 sm:py-5 transition-all duration-300 hover:-translate-y-1"
          style={{
            background: 'rgba(92,47,24,0.3)',
            border: '1px solid rgba(212,165,116,0.15)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(212,165,116,0.4)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(212,165,116,0.15)')}
        >
          <span className="block font-playfair text-2xl sm:text-3xl italic" style={{ color: '#D4A574' }}>60+</span>
          <span className="block text-[9px] sm:text-[10px] tracking-[1px] sm:tracking-[2px] uppercase mt-1.5 whitespace-nowrap" style={{ color: '#AF8774' }}>Artisans</span>
        </div>
      </motion.div>

      {/* Desktop Tooltip: follows cursor */}
      {!isTouchDevice && tooltipContent && (
        <div
          className="pointer-events-none fixed z-50 px-4 py-2 rounded-lg font-lora text-sm tracking-wide"
          style={{
            left: tooltipPos.x + 14,
            top: tooltipPos.y - 12,
            backgroundColor: 'rgba(74, 37, 17, 0.95)',
            border: '1px solid rgba(212, 165, 116, 0.4)',
            color: '#D4A574',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            transform: 'translateY(-100%)',
          }}
        >
          {tooltipContent}
        </div>
      )}
    </section>
  );
};

export default WorldMap;
