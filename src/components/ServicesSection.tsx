import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface ProcessStep {
  numeral: string;
  title: string;
  image: string;
  description: string;
}

const steps: ProcessStep[] = [
  {
    numeral: 'I',
    title: 'You Share',
    image: '/services/step-share.png',
    description:
      'Concepts, moodboards, quantities, budgets, ideas and timelines.',
  },
  {
    numeral: 'II',
    title: 'We Source & Develop',
    image: '/services/step-source.png',
    description:
      'Curated selections, custom options, material alternatives, pricing, lead times, and technical details.',
  },
  {
    numeral: 'III',
    title: 'You Approve',
    image: '/services/step-approve.png',
    description:
      'Specifications are refined, aligned, and locked.',
  },
  {
    numeral: 'IV',
    title: 'We Execute',
    image: '/services/step-execute.jpg',
    description:
      'Supplier coordination, production monitoring, quality control, and delivery follow-up.',
  },
  {
    numeral: 'V',
    title: 'We Style',
    image: '/services/step-style.jpg',
    description:
      'Styling of all project-selected elements, composing atmosphere, identity, and visual coherence.',
  },
];

const ServicesSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  const luxuryEasing = [0.19, 1.0, 0.22, 1.0];

  return (
    <section className="rise bg-scirocco-noam overflow-hidden min-h-screen pt-28 pb-20 px-4 md:px-8">
      {/* Grain texture overlay */}
      <div
        className="fixed inset-0 opacity-[0.015] mix-blend-multiply pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16 md:mb-24 max-w-4xl mx-auto"
        >
          <motion.h1
            className="font-playfair text-5xl md:text-6xl lg:text-7xl mb-8"
            style={{ letterSpacing: '0.05em', lineHeight: '1.2' }}
          >
            <span
              style={{
                background:
                  'linear-gradient(135deg, #F5DEB3 0%, #E8C99A 25%, #D4A574 50%, #E8C99A 75%, #F5DEB3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              OUR SERVICES
            </span>
          </motion.h1>

          <motion.div
            className="h-0.5 w-24 mx-auto mb-8 rounded-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, #D4A574, #F5DEB3, #D4A574, transparent)',
              boxShadow: '0 0 20px rgba(245, 222, 179, 0.3)',
            }}
            initial={prefersReducedMotion ? {} : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: luxuryEasing }}
          />

          <motion.p
            className="font-lora text-xl md:text-2xl text-scirocco-wheat italic max-w-3xl mx-auto"
            style={{ lineHeight: '1.7', letterSpacing: '0.01em' }}
          >
            End-to-end luxury design and procurement, from raw material to refined space.
          </motion.p>
        </motion.div>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 md:gap-6 max-w-7xl mx-auto mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={step.numeral}
              className="rise group flex flex-col items-start hover:-translate-y-1 transition-transform duration-500"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              {/* Roman Numeral Badge */}
              <div className="w-10 h-10 rounded-full bg-scirocco-desert flex items-center justify-center mb-3">
                <span className="font-playfair text-sm font-bold text-scirocco-wheat leading-none">
                  {step.numeral}
                </span>
              </div>

              {/* Title */}
              <h2
                className="font-playfair text-lg md:text-xl font-bold text-scirocco-wheat mb-4 min-h-[2.6em]"
                style={{ letterSpacing: '0.02em', lineHeight: '1.3' }}
              >
                {step.title}
              </h2>

              {/* Image */}
              <div className="w-full aspect-[3/4] rounded-lg overflow-hidden border border-white/10 mb-5">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading={index < 2 ? 'eager' : 'lazy'}
                />
              </div>

              {/* Description */}
              <p className="font-baskerville text-sm text-scirocco-wheat/70 leading-relaxed group-hover:text-scirocco-wheat/90 transition-colors duration-500">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center"
        >
          <p
            className="font-lora text-lg md:text-xl text-scirocco-wheat/80 italic mb-8"
            style={{ letterSpacing: '0.01em' }}
          >
            Ready to start your project?
          </p>
          <button
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent('openInquiryModal', {
                  detail: { mode: 'general', title: 'Our Services', subtitle: 'Tell us about your project' }
                })
              );
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm rounded-full text-scirocco-desert hover:bg-white hover:text-scirocco-noam transition-all duration-300 border border-white/20 hover:border-white/60 cursor-pointer"
          >
            <span className="font-lora text-sm tracking-wide">Contact Us</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
