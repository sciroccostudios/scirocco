import React from 'react';
import { motion } from 'framer-motion';

/**
 * Fixed once at module scope. Randomising during render bakes one set of values
 * into the SSR HTML and generates a different set on hydration.
 */
const PARTICLES = Array.from({ length: 15 }, (_, i) => {
  // Deterministic scatter: cheap hash so the layout is stable across renders.
  const f = (n: number) => ((Math.sin(i * 12.9898 + n) * 43758.5453) % 1 + 1) % 1;
  return {
    size: f(1) * 3 + 1,
    x: f(2) * 100,
    y: f(3) * 100,
    duration: f(4) * 20 + 15,
    delay: f(5) * 5,
    alpha: (f(6) * 0.4 + 0.2).toFixed(2),
    drift: f(7) * 40 - 20,
  };
});

const CollaborationSection: React.FC = () => {
  return (
    <section className="relative w-screen h-screen min-h-[800px] overflow-hidden left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      {/* Background Image - Desktop */}
      <div className="absolute inset-0 hidden md:block">
        <img
          src="/sections/Collaborationbg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/50" />
      </div>

      {/* Background Image - Mobile */}
      <div className="absolute inset-0 md:hidden">
        <img
          src="/sections/Collaborationbg_mobileview.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 flex items-center">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 lg:gap-24 w-full items-center">

          {/* Left Side - Title */}
          <motion.div
            className="flex flex-col justify-center items-center text-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.19, 1.0, 0.22, 1.0] }}
            viewport={{ once: true }}
          >
            {/* Main Title */}
            <motion.div
              className="mb-12 md:mb-24"
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h2
                className="font-lora text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-[0.1em] md:tracking-[0.15em] leading-tight"
                style={{
                  background: 'linear-gradient(135deg, #FFFFF0 0%, #F5DEB3 25%, #D4A574 50%, #F5DEB3 75%, #FFFFF0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundSize: '200% auto',
                }}
              >
                TECHNOLOGY &<br />COLLABORATION
              </h2>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <p
                className="font-playfair text-lg sm:text-xl md:text-3xl lg:text-4xl italic text-scirocco-ivory"
              >
                Expanding Design Through Technology
              </p>
            </motion.div>

            {/* Decorative Line */}
            <motion.div
              className="mt-8 h-0.5 w-32 rounded-full mx-auto"
              style={{
                background: 'linear-gradient(90deg, transparent, #D4A574, #F5DEB3, #D4A574, transparent)',
                boxShadow: '0 0 20px rgba(245, 222, 179, 0.5)',
              }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.7 }}
              viewport={{ once: true }}
            />
          </motion.div>

          {/* Right Side - Description */}
          <motion.div
            className="space-y-6 md:space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.19, 1.0, 0.22, 1.0] }}
            viewport={{ once: true }}
          >
            <motion.h3
              className="font-playfair text-xl sm:text-2xl md:text-4xl lg:text-5xl text-scirocco-ivory font-bold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Virtual reality as a new layer of design intelligence
            </motion.h3>

            <motion.div
              className="space-y-4 md:space-y-6 font-lora text-base sm:text-lg md:text-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <p style={{
                color: '#F5DEB3',
                fontWeight: '400',
              }}>
                We collaborate with <span className="font-bold" style={{
                  color: '#F5DEB3',
                }}>Horizon</span>, our digital partner, to merge physical design with virtual experience.
              </p>

              <p style={{
                color: '#F5DEB3',
                fontWeight: '400',
              }}>
                Through immersive visualization and 3D integration, clients and designers can explore spaces, materials, and furniture selections before they are built.
              </p>

              <p className="italic" style={{
                color: '#F5DEB3',
                fontWeight: '300',
              }}>
                A new layer of precision, where vision meets technology.
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: `radial-gradient(circle, rgba(212, 168, 83, ${p.alpha}), transparent)`,
            }}
            animate={{
              y: [0, -80, 0],
              x: [0, p.drift, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default CollaborationSection;
