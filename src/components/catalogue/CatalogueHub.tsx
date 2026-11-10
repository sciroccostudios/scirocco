import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight, BookOpen } from 'lucide-react';
import DesertBackground from '../DesertBackground';
import { edits, type Edit } from '@/data/edits';

/**
 * Scattered arrangement for the 5-photo cover collage, tuned to the card's 4/5
 * aspect so the lower tiles sit above the text scrim. First tile is on top.
 */
const collagePositions = [
  { place: 'w-[36%] md:w-[40%] top-[2%] left-[3%]', rotate: -3, scale: 1, zIndex: 5 },
  { place: 'w-[34%] md:w-[36%] top-[5%] left-[34%]', rotate: 2, scale: 0.95, zIndex: 4 },
  { place: 'w-[34%] md:w-[36%] top-[1%] left-[62%]', rotate: -2, scale: 0.93, zIndex: 3 },
  { place: 'w-[36%] md:w-[38%] top-[17%] md:top-[24%] left-[12%]', rotate: 1, scale: 0.92, zIndex: 2 },
  { place: 'w-[36%] md:w-[38%] top-[19%] md:top-[27%] left-[52%]', rotate: -1.5, scale: 0.9, zIndex: 1 },
];

/**
 * EditCard - one monthly edit, linking to its PDF viewer page
 */
const EditCard: React.FC<{ edit: Edit; index: number }> = ({ edit, index }) => {
  const prefersReducedMotion = useReducedMotion();
  const smoothEasing = [0.25, 0.46, 0.45, 0.94];

  return (
    <motion.a
      href={`/our-curations/${edit.slug}`}
      whileHover={prefersReducedMotion ? {} : {
        y: -16,
        scale: 1.02,
        transition: { duration: 0.5, ease: smoothEasing }
      }}
      className="rise group block relative overflow-hidden rounded-3xl shadow-[0_15px_60px_rgba(92,47,24,0.25)] hover:shadow-[0_25px_80px_rgba(92,47,24,0.35)] transition-shadow duration-700"
      style={{
        aspectRatio: '4/5',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        animationDelay: `${index * 0.12}s`,
      }}
    >
      {/* Base colour behind the collage */}
      <div className="absolute inset-0" style={{ backgroundColor: '#D4A574' }} />

      {/* `isolate` keeps the tiles' z-index local; without it they paint over the scrim and text. */}
      <div className="absolute inset-0 isolate overflow-hidden transition-transform duration-1000 group-hover:scale-105">
        {edit.coverImages.map((img, i) => {
          const pos = collagePositions[i];
          if (!pos) return null;

          return (
            <motion.div
              key={img}
              className={`absolute aspect-square rounded-2xl overflow-hidden ${pos.place}`}
              style={{
                zIndex: pos.zIndex,
                boxShadow: '0 20px 60px rgba(92, 47, 24, 0.4), 0 8px 20px rgba(0,0,0,0.2)',
              }}
              initial={false}
              animate={{ rotate: pos.rotate, scale: pos.scale }}
            >
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 222, 179, 0.4) 0%, transparent 50%, rgba(212, 165, 116, 0.3) 100%)',
                  padding: '2px',
                }}
              />
              <div className="absolute inset-[2px] rounded-xl overflow-hidden bg-scirocco-deep-sand">
                <img
                  src={img}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Gradient overlay; stronger on small screens where the text sits over the imagery */}
      <div className="absolute inset-0 bg-gradient-to-t from-scirocco-noam opacity-85 group-hover:opacity-95 transition-opacity duration-500 via-scirocco-noam/75 to-scirocco-noam/30 md:via-scirocco-noam/60 md:to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
        <div className="mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
            <BookOpen className="w-7 h-7 text-scirocco-desert" />
          </div>
        </div>

        <p className="font-lora text-xs uppercase tracking-[0.3em] text-scirocco-desert mt-5 md:mt-8 mb-2 opacity-90">
          {edit.monthLabel}
        </p>

        <h2 className="font-playfair text-3xl md:text-4xl text-scirocco-wheat mb-4 group-hover:text-scirocco-ivory transition-colors duration-300">
          {edit.title}
        </h2>

        <p className="font-lora italic text-lg md:text-xl text-scirocco-wheat/80 leading-relaxed mb-6 group-hover:text-scirocco-wheat/90 transition-colors duration-300">
          {edit.subtitle}
        </p>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-scirocco-desert group-hover:bg-white group-hover:text-scirocco-noam transition-all duration-300">
            <span className="font-lora text-sm tracking-wide">{edit.cta}</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </div>
      </div>

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
        <div
          className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle, rgba(245,222,179,0.8) 0%, transparent 70%)',
          }}
        />
      </div>
    </motion.a>
  );
};

/**
 * CatalogueHub - Our Curations page: the monthly edits, newest first
 */
const CatalogueHub: React.FC = () => {
  // A lone card is centred at half width rather than left in a 2-column grid.
  const single = edits.length === 1;

  return (
    <section className="relative min-h-screen pt-24 pb-16 px-4 md:px-8 overflow-hidden">
      <DesertBackground className="absolute inset-0" />
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <p className="font-lora text-sm uppercase tracking-[0.3em] text-scirocco-desert mb-4 mx-auto">
            The Scirocco Edit
          </p>

          <h1
            className="font-playfair text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-scirocco-ivory mb-8"
            style={{ letterSpacing: '0.06em', lineHeight: '1.1' }}
          >
            OUR CURATIONS
          </h1>

          <p
            className="font-lora text-xl md:text-2xl italic text-scirocco-ivory max-w-3xl mx-auto"
            style={{ lineHeight: '1.7' }}
          >
            A monthly exploration of design, craftsmanship and materials, bringing
            together distinctive discoveries from around the world.
          </p>
        </div>

        {/* Edit Cards */}
        <div
          className={`grid grid-cols-1 gap-8 md:gap-12 mb-16 ${
            single ? 'md:max-w-[calc(50%-1.5rem)] md:mx-auto' : 'md:grid-cols-2'
          }`}
        >
          {edits.map((edit, index) => (
            <EditCard key={edit.slug} edit={edit} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          {/*
            ivory, not noam/60. This sits on the dark end of the gradient, where
            the dark-brown brand colour is effectively invisible.
            mx-auto because global.css caps every <p> at 70ch, which otherwise
            pins the block left despite the parent's text-center.
          */}
          <p className="font-baskerville text-scirocco-ivory/85 mb-4 mx-auto">
            Looking for something specific?
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-scirocco-copper to-scirocco-desert text-white font-lora rounded-full hover:from-scirocco-noam hover:to-scirocco-copper transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>Contact Us</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CatalogueHub;
