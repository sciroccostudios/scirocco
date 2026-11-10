import React from 'react';
import { motion } from 'framer-motion';
import GlobalReach from './GlobalReach';
import CollaborationSection from './CollaborationSection';

const WorkSection: React.FC = () => {
  const luxuryEasing = [0.19, 1.0, 0.22, 1.0];
  const smoothEasing = [0.25, 0.46, 0.45, 0.94];

  return (
    <section id="work" className="pb-24 px-4 md:px-8 bg-scirocco-noam overflow-hidden min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        {/* Global Sourcing Network Section - World Map */}
        <GlobalReach />

        {/* Sourcing Without Borders: gradient bridge from dark map into Collaboration */}
        <div
          className="-mx-4 md:-mx-8 lg:-mx-12 xl:-mx-[calc((100vw-1600px)/2+48px)] px-4 md:px-8 lg:px-12 xl:px-12 pt-16 pb-10"
          style={{ background: 'linear-gradient(180deg, #3D1E0D 0%, #4A2511 60%, #5C2F18 100%)' }}
        >
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: luxuryEasing }}
          className="text-center mb-0"
        >
          {/* Decorative Top Element */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: luxuryEasing }}
            viewport={{ once: true }}
          >
            <div
              className="h-px w-16 md:w-24 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.6), rgba(245,222,179,0.8))',
              }}
            />
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: 'radial-gradient(circle, #F5DEB3, #D4A574)',
                boxShadow: '0 0 12px rgba(212,165,116,0.6)',
              }}
            />
            <div
              className="h-px w-16 md:w-24 rounded-full"
              style={{
                background: 'linear-gradient(90deg, rgba(245,222,179,0.8), rgba(212,165,116,0.6), transparent)',
              }}
            />
          </motion.div>

          {/* Enhanced Title with Gradient */}
          <motion.h2
            className="font-lora text-4xl md:text-5xl lg:text-6xl mb-8"
            style={{
              letterSpacing: '0.12em',
              lineHeight: '1.2',
            }}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: smoothEasing }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #FFFFF0 0%, #F5DEB3 25%, #E8E0D6 50%, #F5DEB3 75%, #FFFFF0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% auto',
                display: 'inline-block',
              }}
            >
              SOURCING WITHOUT BORDERS
            </span>
          </motion.h2>

          {/* Decorative Bottom Element */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-10"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: luxuryEasing }}
            viewport={{ once: true }}
          >
            <div
              className="h-px w-12 md:w-20 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.5))',
              }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: 'radial-gradient(circle, #D4A574, #8B6F47)',
                boxShadow: '0 0 8px rgba(212,165,116,0.5)',
              }}
            />
            <div
              className="h-px flex-1 max-w-[60px] md:max-w-[100px] rounded-full"
              style={{
                background: 'linear-gradient(90deg, rgba(212,165,116,0.5), rgba(212,165,116,0.3))',
              }}
            />
            <div
              className="w-1 h-1 rounded-full"
              style={{
                background: '#D4A574',
                boxShadow: '0 0 6px rgba(212,165,116,0.4)',
              }}
            />
            <div
              className="h-px flex-1 max-w-[60px] md:max-w-[100px] rounded-full"
              style={{
                background: 'linear-gradient(90deg, rgba(212,165,116,0.3), rgba(212,165,116,0.5))',
              }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: 'radial-gradient(circle, #D4A574, #8B6F47)',
                boxShadow: '0 0 8px rgba(212,165,116,0.5)',
              }}
            />
            <div
              className="h-px w-12 md:w-20 rounded-full"
              style={{
                background: 'linear-gradient(90deg, rgba(212,165,116,0.5), transparent)',
              }}
            />
          </motion.div>

          {/* Enhanced Description Text */}
          <motion.div
            className="max-w-4xl mx-auto space-y-6"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: smoothEasing }}
          >
            <p
              className="font-lora text-lg md:text-xl italic"
              style={{
                lineHeight: '1.9',
                letterSpacing: '0.025em',
                fontWeight: '300',
                color: '#F5DEB3',
              }}
            >
              Each project starts with a story: a geography, a rhythm, a sense of place. We translate that narrative into curated compositions of furniture, lighting, and materials.
            </p>
            <p
              className="font-lora text-lg md:text-xl italic"
              style={{
                lineHeight: '1.9',
                letterSpacing: '0.025em',
                fontWeight: '300',
                color: '#F5DEB3',
              }}
            >
              Through our network of artisans and manufacturers across Europe, North Africa and Asia, we source without borders, connecting cultures, crafts, and materials into cohesive design stories.
            </p>
          </motion.div>
        </motion.div>
        </div>

        {/* Collaboration Section */}
        <div className="-mx-4 md:-mx-8 lg:-mx-12 xl:-mx-[calc((100vw-1600px)/2+48px)] mt-20">
          <CollaborationSection />
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
