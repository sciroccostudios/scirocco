import React, { useEffect, useRef } from 'react';

interface DustCloud {
  x: number;
  y: number;
  size: number;
  speedX: number;
  opacity: number;
}

interface HeroDustEffectProps {
  /** Intensity of the sandstorm effect from 0 (invisible) to 1 (full effect) */
  intensity?: number;
}

/** Canvas sandstorm for the hero. Drifting dust clouds, no external library. */
const HeroDustEffect: React.FC<HeroDustEffectProps> = ({ intensity = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dustCloudsRef = useRef<DustCloud[]>([]);
  const animationRef = useRef<number>();
  const intensityRef = useRef(intensity);

  // Keep intensity ref in sync with prop
  useEffect(() => {
    intensityRef.current = intensity;
  }, [intensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Detect mobile for performance optimization
    const isMobile = window.innerWidth < 768;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize dust clouds (atmospheric haze)
    const cloudCount = isMobile ? 80 : 160;
    const dustClouds: DustCloud[] = [];

    for (let i = 0; i < cloudCount; i++) {
      dustClouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 150 + 80,
        speedX: canvas.width * (Math.random() * 0.008 + 0.005),
        opacity: Math.random() * 0.12 + 0.05,
      });
    }
    dustCloudsRef.current = dustClouds;

    const animate = () => {
      const currentIntensity = intensityRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // Skip if intensity is 0
      if (currentIntensity <= 0) {
        ctx.clearRect(0, 0, width, height);
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Clear canvas each frame (no trail tint)
      ctx.clearRect(0, 0, width, height);

      // Draw dust clouds (background atmosphere)
      dustCloudsRef.current.forEach((cloud) => {
        const gradient = ctx.createRadialGradient(
          cloud.x, cloud.y, 0,
          cloud.x, cloud.y, cloud.size
        );
        const cloudOpacity = cloud.opacity * currentIntensity;
        gradient.addColorStop(0, `rgba(180, 140, 100, ${cloudOpacity})`);
        gradient.addColorStop(1, 'rgba(180, 140, 100, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
        ctx.fill();

        // Move cloud
        cloud.x += cloud.speedX;
        if (cloud.x > width + cloud.size) {
          cloud.x = -cloud.size;
          cloud.y = Math.random() * height;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 pointer-events-none"
      style={{
        opacity: intensity > 0 ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
      }}
    />
  );
};

export default HeroDustEffect;
