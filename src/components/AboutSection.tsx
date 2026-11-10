import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const AboutSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="about" className="relative overflow-hidden min-h-screen">
      <div className="relative z-10">
        {/* The Wind as Design Philosophy - Editorial Magazine Layout */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.19, 1.0, 0.22, 1.0] }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative overflow-hidden"
        >
          {/* Desert Background Image: backdrop for the Essence block */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/cards/Theessenceofwind.png')`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              zIndex: 0
            }}
          />

          {/* Fade in from the top (mobile only) */}
          <div className="lg:hidden absolute inset-x-0 top-0 bottom-0" style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 20%, rgba(0,0,0,0) 45%)',
            zIndex: 1,
            pointerEvents: 'none'
          }} />

          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" style={{ zIndex: 2 }} />

          {/* Grain texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.015] mix-blend-multiply pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              zIndex: 3
            }}
          />

          {/* Content container */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-8">
            <div className="relative max-w-6xl mx-auto">
              {/* The Essence of Wind - Full Width Image */}
              <motion.div
                className="w-screen relative left-1/2 right-1/2 -mx-[50vw]"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.19, 1.0, 0.22, 1.0] }}
                viewport={{ once: true }}
              >
                {/* Desktop Layout */}
                <div className="hidden lg:block relative w-full aspect-[21/9] overflow-hidden">
                  <img
                    src="/cards/Theessenceofwind.png"
                    alt="The Essence of Wind"
                    className="w-full h-full object-cover"
                  />

                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />

                  {/* Text Content Container - Desktop */}
                  <div className="absolute inset-0 flex items-center px-8 md:px-16 lg:px-24">

                    {/* Left Side - Main Title */}
                    <motion.div
                      className="w-1/3 pr-8"
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1, delay: 0.3, ease: [0.19, 1.0, 0.22, 1.0] }}
                      viewport={{ once: true }}
                    >
                      <h2 className="font-playfair text-scirocco-wheat text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight" style={{ letterSpacing: '0.05em' }}>
                        THE ESSENCE OF THE WIND
                      </h2>
                      <p className="font-lora text-scirocco-wheat text-lg md:text-xl italic" style={{ letterSpacing: '0.02em' }}>
                        In the language of materials, silence speaks.
                      </p>
                    </motion.div>

                    <div className="flex-1"></div>

                    {/* Right Side - Philosophy Text */}
                    <motion.div
                      className="w-1/3"
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1, delay: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
                      viewport={{ once: true }}
                    >
                      <h3 className="font-playfair text-scirocco-wheat text-2xl md:text-3xl font-semibold mb-4" style={{ letterSpacing: '0.05em' }}>
                        The Wind as Design Philosophy
                      </h3>
                      <p className="font-lora text-scirocco-wheat text-sm md:text-base leading-relaxed" style={{ lineHeight: '1.8', letterSpacing: '0.01em' }}>
                        Scirocco, the warm wind that travels from the desert to the Mediterranean, carries more than dust and heat.
                        It carries stories. Traces of craft, fragments of time, the rhythm of hands shaping matter.
                        At Scirocco Studio, we design with that same movement, transforming raw materials into form, and form into dialogue.
                        Each object, each texture, is a memory of its making.
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden relative w-full overflow-hidden">
                  {/* Top Section - Image 1 with Title */}
                  <div className="relative w-full h-[50vh] overflow-hidden">
                    <img
                      src="/cards/Theessenceofwind1.png"
                      alt="The Essence of Wind"
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Blend gradient at bottom edge */}
                    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-black/50 to-black" style={{ zIndex: 1 }} />

                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" style={{ zIndex: 2 }} />

                    {/* Top - Main Title */}
                    <motion.div
                      className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8"
                      style={{ zIndex: 10 }}
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <h2 className="font-playfair text-scirocco-wheat text-3xl sm:text-4xl font-bold mb-3 leading-tight" style={{ letterSpacing: '0.05em' }}>
                        THE ESSENCE OF THE WIND
                      </h2>
                      <p className="font-lora text-scirocco-wheat text-base sm:text-lg italic" style={{ letterSpacing: '0.02em' }}>
                        In the language of materials, silence speaks.
                      </p>
                    </motion.div>
                  </div>

                  {/* Bottom Section - Image 2 with Philosophy Text */}
                  <div className="relative w-full h-[50vh] overflow-hidden">
                    <div className="absolute inset-0">
                      <img
                        src="/cards/Theessenceofwind2.png"
                        alt="The Wind as Design Philosophy"
                        className="w-full h-full object-cover"
                      />
                      {/* Fade out the bottom of this image */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" style={{
                        background: 'linear-gradient(to bottom, transparent 0%, transparent 60%, black 100%)'
                      }} />
                    </div>

                    {/* Blend gradient at top edge */}
                    <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-t from-transparent via-black/50 to-black" style={{ zIndex: 1 }} />

                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-transparent" style={{ zIndex: 2 }} />

                    {/* Bottom - Philosophy Text */}
                    <motion.div
                      className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8"
                      style={{ zIndex: 10 }}
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      viewport={{ once: true }}
                    >
                      <h3 className="font-playfair text-scirocco-wheat text-xl sm:text-2xl font-semibold mb-3" style={{ letterSpacing: '0.05em' }}>
                        The Wind as Design Philosophy
                      </h3>
                      <p className="font-lora text-scirocco-wheat text-sm sm:text-base leading-relaxed" style={{ lineHeight: '1.7', letterSpacing: '0.01em' }}>
                        Scirocco, the warm wind that travels from the desert to the Mediterranean, carries more than dust and heat.
                        It carries stories. Traces of craft, fragments of time, the rhythm of hands shaping matter.
                        At Scirocco Studio, we design with that same movement, transforming raw materials into form, and form into dialogue.
                        Each object, each texture, is a memory of its making.
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>

        {/* Founded Section - Editorial Manifesto */}
        <div className="relative bg-gradient-to-b from-[#A85C28] via-[#86471C] to-[#4A2511] py-12 md:py-16 overflow-hidden mt-0">

          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.02] mix-blend-multiply pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Giant decorative 'R' watermark */}
          <div className="absolute top-0 left-0 lg:left-20 opacity-[0.03] pointer-events-none select-none overflow-hidden">
            <span className="font-playfair text-[500px] lg:text-[700px] font-bold text-scirocco-noam leading-none">
              R
            </span>
          </div>

          <div className="relative max-w-[1600px] mx-auto px-6 lg:px-12">

            {/* DESKTOP: Centered Layout */}
            <div className="hidden lg:flex flex-col items-center">

              {/* Text Content */}
              <div className="w-full max-w-4xl text-center">

                {/* First Paragraph - Large Intro */}
                <motion.p
                  className="font-baskerville text-xl xl:text-2xl text-scirocco-wheat mb-8"
                  style={{ lineHeight: '2', letterSpacing: '0.01em' }}
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <span className="font-playfair text-8xl leading-none text-scirocco-wheat mr-3">S</span>
                  cirocco Studio was born from a vision to bridge design and procurement.
                  We translate architectural intent into tangible environments: specifying,
                  sourcing, and coordinating everything from custom furniture to final installation.
                </motion.p>

                {/* Pull Quote */}
                <motion.div
                  className="my-16"
                  initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <p className="font-lora text-3xl xl:text-4xl italic text-scirocco-wheat" style={{ lineHeight: '1.6', letterSpacing: '0.01em' }}>
                    <span className="text-6xl text-scirocco-wheat/40">"</span>
                    delivering quality without compromise
                    <span className="text-6xl text-scirocco-wheat/40">"</span>
                  </p>
                </motion.div>

              </div>

              {/* Image Strip */}
              <motion.div
                className="mt-24 w-full"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="relative rounded-xl overflow-hidden">
                  <div className="flex gap-4 relative h-96">
                    {/* Image 1 - Textiles */}
                    <div className="relative h-full overflow-hidden rounded-lg flex-1">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('/sections/section2bg1.png')` }}
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Image 2 - Stone */}
                    <div className="relative h-full overflow-hidden rounded-lg flex-1">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('/sections/section2bg2.png')` }}
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Image 3 - Wood */}
                    <div className="relative h-full overflow-hidden rounded-lg flex-1">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('/sections/section2bg3.png')` }}
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Image 4 - Glass */}
                    <div className="relative h-full overflow-hidden rounded-lg flex-1">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('/sections/section2bg4.png')` }}
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="w-full max-w-4xl text-center">
                {/* Second Paragraph */}
                <motion.p
                  className="font-baskerville text-lg xl:text-xl text-scirocco-wheat max-w-3xl mx-auto"
                  style={{ lineHeight: '1.9', letterSpacing: '0.01em' }}
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <strong className="text-scirocco-wheat font-medium">With a focus on</strong> materials, makers, and manufacturing networks across Europe
                  and beyond, we work as an extension of design teams. Each project reflects a dialogue between light, material, and form,
                  translating creative vision into curated selections that balance aesthetics with practicality.
                </motion.p>
              </div>
            </div>

            {/* MOBILE: Text + 2x2 Image Grid */}
            <div className="lg:hidden space-y-12">

              {/* Text Content */}
              <motion.div
                className="space-y-6 px-4"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <p className="font-baskerville text-base sm:text-lg text-scirocco-wheat" style={{ lineHeight: '2', letterSpacing: '0.01em' }}>
                  <span className="float-left font-playfair text-6xl leading-none text-scirocco-wheat mr-2 mt-1">S</span>
                  cirocco Studio was born from a vision to bridge design and procurement.
                  We translate architectural intent into tangible environments: specifying,
                  sourcing, and coordinating everything from custom furniture to final installation.
                </p>

                <div className="pl-6 border-l-4 border-white/30">
                  <p className="font-lora text-xl sm:text-2xl italic text-scirocco-wheat" style={{ lineHeight: '1.6', letterSpacing: '0.01em' }}>
                    <span className="text-4xl text-scirocco-wheat/40">"</span>
                    delivering quality without compromise
                    <span className="text-4xl text-scirocco-wheat/40">"</span>
                  </p>
                </div>

                <p className="font-baskerville text-base text-scirocco-wheat" style={{ lineHeight: '2', letterSpacing: '0.01em' }}>
                  <strong className="text-scirocco-wheat font-medium">With a focus on</strong> materials, makers, and manufacturing networks across Europe
                  and beyond, we work as an extension of design teams.
                </p>
              </motion.div>

              {/* 2x2 Image Grid */}
              <div className="relative px-4">
                <div className="grid grid-cols-2 gap-3">
                  {/* Image 1 - Textiles */}
                  <div
                    className="relative overflow-hidden rounded-lg border-2 border-white/40 shadow-xl"
                    style={{ aspectRatio: '1/1' }}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('/sections/section2bg1.png')` }}
                    />
                  </div>

                  {/* Image 2 - Stone */}
                  <div
                    className="relative overflow-hidden rounded-lg border-2 border-white/40 shadow-xl"
                    style={{ aspectRatio: '1/1' }}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('/sections/section2bg2.png')` }}
                    />
                  </div>

                  {/* Image 3 - Wood */}
                  <div
                    className="relative overflow-hidden rounded-lg border-2 border-white/40 shadow-xl"
                    style={{ aspectRatio: '1/1' }}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('/sections/section2bg3.png')` }}
                    />
                  </div>

                  {/* Image 4 - Glass */}
                  <div
                    className="relative overflow-hidden rounded-lg border-2 border-white/40 shadow-xl"
                    style={{ aspectRatio: '1/1' }}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('/sections/section2bg4.png')` }}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
