import React, { useEffect, useState } from 'react';
import { useScrollLock } from './useScrollLock';
import HeroBackgroundCrossfade from './HeroBackgroundCrossfade';
import HeroContentReveal from './HeroContentReveal';
import HeroDustEffect from './HeroDustEffect';

/**
 * Hero that converts scroll into animation progress before releasing the page.
 * Wind fades 0-75%, background crossfades 30-100%, text reveals 60-100%.
 */
const HeroSectionScrollLocked: React.FC = () => {
  const { progress, isLocked } = useScrollLock({
    sensitivity: 1,
    persistCompletion: false,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate wind intensity (100% at 0 progress, 0% at 75% progress)
  const windIntensity = Math.max(0, 1 - progress / 75);

  // Pre-hydration. The h1 must render here too, otherwise the served HTML has no
  // top-level heading at all and the document outline starts at h2.
  if (!mounted) {
    return (
      <section className="relative w-full min-h-screen min-h-[100dvh] bg-scirocco-desert">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/hero-bg-initial.png)' }} />
        <div className="sr-only">
          <h1>Scirocco Studio</h1>
          <p>Every form begins with a current. Design, procurement, craftsmanship.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Main hero container */}
      <section
        className={isLocked
          ? 'fixed inset-0 bg-scirocco-desert overflow-hidden'
          : 'relative w-full min-h-screen min-h-[100dvh] bg-scirocco-desert'}
        style={{
          zIndex: isLocked ? 50 : 0,
        }}
        aria-label="Hero section"
      >
        {/* Background layers with crossfade */}
        <HeroBackgroundCrossfade progress={progress} />

        {/* Dust particle effect */}
        <HeroDustEffect intensity={windIntensity} />

        {/* Content overlay with progressive reveal */}
        <HeroContentReveal progress={progress} />
      </section>
    </>
  );
};

export default HeroSectionScrollLocked;
