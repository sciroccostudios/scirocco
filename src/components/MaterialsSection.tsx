import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Material {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  description: string;
  image?: string;
  imageMobile?: string;
  imageDesktop?: string;
}

const materials: Material[] = [
  {
    id: 'brass',
    name: 'Brass',
    subtitle: 'Brushed, polished, or patinated',
    color: '#945C4F',
    description: 'Shaped by flame, brass carries warmth and elegance through time.',
    imageMobile: '/products/Brass-ProductCard.png',
    imageDesktop: '/products/Brass-ProductCardDesktop.png'
  },
  {
    id: 'wood',
    name: 'Wood',
    subtitle: 'Curved by craftsmanship',
    color: '#8B6F47',
    description: 'Each grain tells a story of growth, patience, and transformation.',
    image: '/products/Wood-ProductCard.png'
  },
  {
    id: 'onyx',
    name: 'Onyx',
    subtitle: 'Translucent depth',
    color: '#AF8774',
    description: 'Light passes through layers of time, revealing hidden beauty.',
    image: '/products/OnyxStone-ProductCard.png'
  },
  {
    id: 'leather',
    name: 'Leather',
    subtitle: 'The art of touch',
    color: '#A87F66',
    description: 'Softened by use, enriched by age, leather remembers every interaction.',
    image: '/products/Leather-ProductCard.png'
  },
  {
    id: 'fabric',
    name: 'Fabric',
    subtitle: 'Woven by Italian looms',
    color: '#D4B5A0',
    description: 'Threads interlaced with tradition, creating textures that speak.',
    image: '/products/Fabric-ProductCard.png'
  },
  {
    id: 'murano',
    name: 'Murano Glass',
    subtitle: 'Hand-blown in Venice',
    color: '#C19A6B',
    description: 'Breath becomes form, fire becomes art in the hands of masters.',
    image: '/products/MuranoGlass-ProductCard.png'
  },
  {
    id: 'travertine',
    name: 'Marble and Granite',
    subtitle: 'Timeless elegance, natural strength',
    color: '#F5DEB3',
    description: 'Ancient stone bearing the marks of millennia, timeless and enduring.',
    image: '/products/Travertino-ProductCard.png'
  }
];

// Optimized Image Component with progressive loading
const ProgressiveImage: React.FC<{
  src: string;
  color: string;
  isMobile?: boolean;
  className?: string;
}> = ({ src, color, isMobile = false, className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    // Reveal on error too, otherwise a 404 leaves the card blurred forever.
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsLoaded(true);
    img.src = src;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <div
      className={`absolute inset-0 transition-all duration-1000 ${className} ${
        isMobile ? 'md:hidden' : 'hidden md:block'
      }`}
      style={{
        backgroundColor: color,
        backgroundImage: isLoaded ? `url(${src})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: isLoaded ? 'blur(0px)' : 'blur(20px)',
        transform: isLoaded ? 'scale(1)' : 'scale(1.1)'
      }}
    >
      {/* Color placeholder visible until image loads */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background: `linear-gradient(135deg, ${color}40 0%, ${color}80 100%)`
        }}
      />
    </div>
  );
};

const MaterialsSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const layoutPattern = ['full', 'half', 'half', 'half', 'half', 'full', 'full'];

  // Luxury easing curves
  const luxuryEasing = [0.19, 1.0, 0.22, 1.0]; // Exponential ease-out
  const smoothEasing = [0.25, 0.46, 0.45, 0.94]; // Smooth cubic

  return (
    <section
      id="materials"
      className="pt-16 pb-0 overflow-hidden min-h-screen"
      style={{ background: 'linear-gradient(180deg, #4A2511 0%, #5C2F18 40%, #5C2F18 100%)' }}
    >
      {/* Header with elegant reveal */}
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 60, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 1.2,
            ease: luxuryEasing,
            delay: 0.1
          }}
          viewport={{ once: true, margin: "-80px", amount: 0.3 }}
          className="text-center mb-20"
        >
          <motion.h2
            className="font-playfair text-5xl md:text-6xl lg:text-7xl text-scirocco-wheat mb-8"
            style={{ letterSpacing: '0.05em', lineHeight: '1.2' }}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: smoothEasing }}
            viewport={{ once: true }}
          >
            THE LANGUAGE OF MATERIALS
          </motion.h2>

          <motion.p
            className="font-lora text-xl md:text-2xl text-scirocco-wheat italic max-w-3xl mx-auto"
            style={{ lineHeight: '1.7', letterSpacing: '0.01em' }}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: smoothEasing }}
            viewport={{ once: true }}
          >
            Every material carries its own memory: marble shaped by centuries,
            metal by flame, glass by breath.
          </motion.p>

          <motion.p
            className="font-baskerville text-base md:text-lg text-scirocco-wheat/90 mt-6 max-w-2xl mx-auto"
            style={{ lineHeight: '1.9', letterSpacing: '0.01em' }}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: smoothEasing }}
            viewport={{ once: true }}
          >
            Our role is to listen, to reveal rather than impose.
            The result is a form that feels discovered, not designed.
          </motion.p>
        </motion.div>
      </div>

      {/* Material Cards Grid - Premium scroll animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {materials.map((material, index) => {
          const isFullWidth = layoutPattern[index] === 'full';

          // Create varied animation patterns for visual interest
          const animationVariants = {
            hidden: prefersReducedMotion ? {
              opacity: 1
            } : {
              opacity: 0,
              scale: 0.85,
              y: 80,
              rotateX: 15,
              filter: 'blur(10px)'
            },
            visible: {
              opacity: 1,
              scale: 1,
              y: 0,
              rotateX: 0,
              filter: 'blur(0px)',
              transition: {
                duration: 1.0,
                delay: index * 0.12, // Staggered reveals
                ease: luxuryEasing,
                opacity: { duration: 0.8, ease: smoothEasing },
                scale: { duration: 1.2, ease: luxuryEasing },
                y: { duration: 1.0, ease: luxuryEasing }
              }
            }
          };

          return (
            <motion.div
              key={material.id}
              initial="hidden"
              whileInView="visible"
              variants={animationVariants}
              viewport={{
                once: true,
                margin: "-120px", // Start animation earlier for smoother experience
                amount: 0.2
              }}
              whileHover={prefersReducedMotion ? {} : {
                scale: 1.02,
                transition: { duration: 0.4, ease: smoothEasing }
              }}
              className={`relative group overflow-hidden shadow-[0_8px_30px_rgba(92,47,24,0.3)] hover:shadow-[0_12px_40px_rgba(196,166,138,0.4)] transition-shadow duration-700 ${
                isFullWidth ? 'md:col-span-2' : 'md:col-span-1'
              }`}
              style={{
                minHeight: isFullWidth ? '600px' : '450px',
                height: isFullWidth ? '600px' : '450px',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                willChange: 'transform, opacity'
              }}
            >
              {/* Progressive Image Loading - Mobile */}
              {(material.imageMobile || material.image) && (
                <ProgressiveImage
                  src={material.imageMobile || material.image!}
                  color={material.color}
                  isMobile={true}
                  className="transition-transform duration-1000 group-hover:scale-105"
                />
              )}

              {/* Progressive Image Loading - Desktop */}
              {(material.imageDesktop || material.image) && (
                <ProgressiveImage
                  src={material.imageDesktop || material.image!}
                  color={material.color}
                  isMobile={false}
                  className="transition-transform duration-1000 group-hover:scale-105"
                />
              )}

              {/* Fallback - No Image */}
              {!material.image && !material.imageMobile && !material.imageDesktop && (
                <div
                  className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105"
                  style={{
                    backgroundColor: material.color,
                    backgroundImage: `linear-gradient(135deg, ${material.color}20 0%, ${material.color}60 100%)`
                  }}
                />
              )}

              {/* Elegant gradient overlay with smooth transitions */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-scirocco-noam/85 via-scirocco-noam/40 to-transparent"
                initial={{ opacity: 0.5 }}
                whileInView={{ opacity: 0.6 }}
                whileHover={{ opacity: 0.75 }}
                transition={{ duration: 0.6, ease: smoothEasing }}
              />

              {/* Content Overlay - Animated on scroll */}
              <motion.div
                className="absolute inset-0 flex flex-col justify-end p-8 md:p-10"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.12 + 0.3,
                  ease: smoothEasing
                }}
                viewport={{ once: true }}
              >
                <div className="transform transition-all duration-700 group-hover:translate-y-0 translate-y-2">
                  {/* Roman Numeral - Elegant fade */}
                  <motion.div
                    className="absolute top-6 right-6 font-playfair text-4xl md:text-5xl text-scirocco-wheat/10 group-hover:text-scirocco-wheat/20 transition-all duration-700"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 0.1, scale: 1 }}
                    transition={{ duration: 1, delay: index * 0.12 + 0.5 }}
                    viewport={{ once: true }}
                  >
                    {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][index]}
                  </motion.div>

                  {/* Material Title & Info */}
                  <div className="relative z-10">
                    <motion.h3
                      className="font-playfair text-3xl md:text-4xl text-scirocco-wheat font-bold mb-2 transform transition-transform duration-700 group-hover:-translate-y-2"
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.12 + 0.4,
                        ease: smoothEasing
                      }}
                      viewport={{ once: true }}
                    >
                      {material.name}
                    </motion.h3>

                    <motion.p
                      className="font-lora text-base md:text-lg text-scirocco-wheat italic mb-4 opacity-90"
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                      whileInView={{ opacity: 0.9, x: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.12 + 0.5,
                        ease: smoothEasing
                      }}
                      viewport={{ once: true }}
                    >
                      {material.subtitle}
                    </motion.p>

                    {/*
                      Plain <p>: framer-motion would write an inline opacity that
                      outranks group-hover:opacity-100, so the reveal never fired.
                    */}
                    <p className="font-baskerville text-sm md:text-base text-scirocco-wheat leading-relaxed max-w-2xl opacity-0 group-hover:opacity-100 transform translate-y-6 group-hover:translate-y-0 transition-all duration-700 delay-100">
                      {material.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default MaterialsSection;
