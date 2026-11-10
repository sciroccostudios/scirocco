import React from 'react';

interface HeroBackgroundCrossfadeProps {
  /** Progress from 0 to 100, crossfade happens between 30-100% */
  progress: number;
}

/** Two stacked backgrounds, crossfaded between 30% and 100% progress. */
const HeroBackgroundCrossfade: React.FC<HeroBackgroundCrossfadeProps> = ({ progress }) => {
  const crossfadeProgress = Math.max(0, Math.min(1, (progress - 30) / 70));

  const initialOpacity = 1 - crossfadeProgress;
  const finalOpacity = crossfadeProgress;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-scirocco-desert">
      {/* Initial background - desert sand scene */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/hero-bg-initial.png)',
          opacity: initialOpacity,
          willChange: 'opacity',
          transition: 'opacity 0.1s ease-out',
        }}
        aria-hidden="true"
      />

      {/* Final background - cleared scene */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/hero-bg-final.png)',
          opacity: finalOpacity,
          willChange: 'opacity',
          transition: 'opacity 0.1s ease-out',
        }}
        aria-hidden="true"
      />

      {/* Subtle vignette overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.2) 100%)',
        }}
        aria-hidden="true"
      />
    </div>
  );
};

export default HeroBackgroundCrossfade;
