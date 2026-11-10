import React from 'react';

interface HeroContentRevealProps {
  /** Progress from 0 to 100, determines text visibility */
  progress: number;
}

/** Shared reveal mapping: 0 at progress=0, 1 at progress=75, easeOutCubic */
const getReveal = (progress: number) => {
  const t = Math.min(1, Math.max(0, progress / 75));
  return 1 - Math.pow(1 - t, 3);
};

/**
 * Progressive text reveal component for the hero section.
 *
 * Timeline:
 * - Logo: Reveals from 0-75% progress (matching sandstorm clearing)
 * - "SCIROCCO STUDIO": Fades in at 60-75% progress
 * - Tagline: Fades in at 75-90% progress
 * - Services: Fades in at 90-100% progress
 */
const HeroContentReveal: React.FC<HeroContentRevealProps> = ({ progress }) => {
  const reveal = getReveal(progress);

  // Calculate individual element opacities based on progress ranges
  // Studio name: 60% to 75%
  const studioNameOpacity = Math.max(0, Math.min(1, (progress - 60) / 15));

  // Tagline: 75% to 90%
  const taglineOpacity = Math.max(0, Math.min(1, (progress - 75) / 15));

  // Services: 90% to 100%
  const servicesOpacity = Math.max(0, Math.min(1, (progress - 90) / 10));

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center">

        {/* Logo - progressive reveal */}
        <img
          src="/scirocco.svg"
          alt="Scirocco Studio"
          className="w-[154px] h-[154px] md:w-[230px] md:h-[230px] lg:w-[269px] lg:h-[269px] object-contain drop-shadow-2xl"
          style={{
            opacity: 0.12 + reveal * 0.88,
            filter: `drop-shadow(0 4px 20px rgba(0, 0, 0, ${0.3 * reveal}))`,
            willChange: 'opacity, filter',
          }}
        />

        {/* Studio Name */}
        <h1
          className="mt-6 md:mt-8 font-playfair text-3xl md:text-5xl lg:text-6xl font-bold text-scirocco-wheat tracking-wider"
          style={{
            opacity: studioNameOpacity,
            transform: `translateY(${(1 - studioNameOpacity) * 20}px)`,
            transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
            willChange: 'opacity, transform',
          }}
        >
          SCIROCCO STUDIO
        </h1>

        {/* Tagline */}
        <p
          className="mt-4 md:mt-6 font-lora text-lg md:text-2xl lg:text-3xl text-scirocco-wheat/90 italic tracking-wide max-w-2xl text-center px-4"
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${(1 - taglineOpacity) * 20}px)`,
            transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
            willChange: 'opacity, transform',
          }}
        >
          Every form begins with a current
        </p>

        {/* Services */}
        <p
          className="mt-4 md:mt-6 font-lora text-sm md:text-base lg:text-lg text-scirocco-wheat/80 tracking-[0.05em] md:tracking-[0.4em] uppercase text-center px-4"
          style={{
            opacity: servicesOpacity,
            transform: `translateY(${(1 - servicesOpacity) * 20}px)`,
            transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
            willChange: 'opacity, transform',
          }}
        >
          Design · Procurement · Craftsmanship
        </p>
      </div>
    </div>
  );
};

export default HeroContentReveal;
