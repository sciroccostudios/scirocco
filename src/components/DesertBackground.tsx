import React from 'react';
import { motion } from 'framer-motion';

interface DesertBackgroundProps {
  className?: string;
}

/** Layered desert backdrop: gradient, drifting shimmer, and a grain overlay. */
const DesertBackground: React.FC<DesertBackgroundProps> = ({
  className = 'absolute inset-0 -z-10',
}) => {
  return (
    <div className={className}>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 150% 100% at 50% 100%, #5C2F18 0%, transparent 70%),
            linear-gradient(180deg,
              #5C2F18 0%,
              #7A5C42 6%,
              #A87F66 12%,
              #D4A574 18%,
              #C9996B 40%,
              #B8956A 55%,
              #A87F66 70%,
              #8B6F47 85%,
              #5C2F18 100%
            )
          `,
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[200%] h-full"
          style={{
            background: `
              repeating-linear-gradient(
                100deg,
                transparent 0%,
                rgba(212, 165, 116, 0.08) 5%,
                transparent 10%
              )
            `,
          }}
          animate={{
            x: ['-50%', '0%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

    </div>
  );
};

export default DesertBackground;
