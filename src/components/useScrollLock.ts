import { useState, useEffect, useRef, useCallback } from 'react';

interface ScrollLockOptions {
  /** Sensitivity multiplier for scroll input */
  sensitivity?: number;
  /** Whether to check sessionStorage for completion state */
  persistCompletion?: boolean;
  /** Storage key for completion state */
  storageKey?: string;
  /** Duration in ms for auto-advance animation when hash is detected */
  hashSkipDuration?: number;
}

interface ScrollLockState {
  /** Current progress from 0 to 100 */
  progress: number;
  /** Whether the animation is complete */
  isComplete: boolean;
  /** Whether scroll is currently locked */
  isLocked: boolean;
  /** Skip to end immediately */
  skipToEnd: () => void;
}

const STORAGE_KEY = 'hero-scroll-complete';

/**
 * Locks page scroll and converts wheel/touch/key input into progress (0-100).
 * Honours prefers-reduced-motion and can persist completion in sessionStorage.
 */
export function useScrollLock(options: ScrollLockOptions = {}): ScrollLockState {
  const {
    sensitivity = 1,
    persistCompletion = false,
    storageKey = STORAGE_KEY,
    hashSkipDuration = 500,
  } = options;

  // Check for prior completion on mount
  type InitMode = 'normal' | 'skip' | 'auto-advance';
  const getInitialState = (): { progress: number; isComplete: boolean; mode: InitMode } => {
    if (typeof window === 'undefined') return { progress: 0, isComplete: false, mode: 'normal' };

    if (persistCompletion) {
      const stored = sessionStorage.getItem(storageKey);
      if (stored === 'true') {
        return { progress: 100, isComplete: true, mode: 'skip' };
      }
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return { progress: 100, isComplete: true, mode: 'skip' };
    }

    // Hash navigation: auto-advance with quick animation instead of full scroll-lock
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      return { progress: 0, isComplete: false, mode: 'auto-advance' };
    }

    return { progress: 0, isComplete: false, mode: 'normal' };
  };

  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isLocked, setIsLocked] = useState(true);

  const progressRef = useRef(0);
  const isCompleteRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const touchStartY = useRef(0);
  const lastTouchY = useRef(0);

  const skipToEnd = useCallback(() => {
    progressRef.current = 100;
    isCompleteRef.current = true;
    setProgress(100);
    setIsComplete(true);
    setIsLocked(false);

    if (persistCompletion && typeof window !== 'undefined') {
      sessionStorage.setItem(storageKey, 'true');
    }

    // Restore body scroll
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  }, [persistCompletion, storageKey]);

  // Scroll to the URL hash target with retry for lazy-hydrated sections
  const scrollToHash = useCallback(() => {
    const hash = window.location.hash;
    if (!hash || hash.length <= 1) return;

    const targetId = hash.substring(1);
    const attemptScroll = (attempts: number) => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (attempts > 0) {
        setTimeout(() => attemptScroll(attempts - 1), 100);
      }
    };
    attemptScroll(5);
  }, []);

  useEffect(() => {
    // Check initial state
    const initialState = getInitialState();

    // Instant skip (reduced motion, sessionStorage)
    if (initialState.mode === 'skip') {
      progressRef.current = 100;
      isCompleteRef.current = true;
      setProgress(100);
      setIsComplete(true);
      setIsLocked(false);
      window.dispatchEvent(new CustomEvent('heroAnimationComplete'));
      scrollToHash();
      return;
    }

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    // Auto-advance mode: animate progress 0->100 over hashSkipDuration
    if (initialState.mode === 'auto-advance') {
      const duration = hashSkipDuration;
      const startTime = performance.now();

      const easeInOutCubic = (t: number): number =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const advanceFrame = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const t = Math.min(1, elapsed / duration);
        const easedProgress = easeInOutCubic(t) * 100;

        progressRef.current = easedProgress;
        setProgress(easedProgress);

        if (t < 1) {
          rafRef.current = requestAnimationFrame(advanceFrame);
        } else {
          // Complete
          progressRef.current = 100;
          isCompleteRef.current = true;
          setProgress(100);
          setIsComplete(true);
          setIsLocked(false);

          window.dispatchEvent(new CustomEvent('heroAnimationComplete'));

          if (persistCompletion) {
            sessionStorage.setItem(storageKey, 'true');
          }

          document.body.style.overflow = originalOverflow;
          document.body.style.touchAction = originalTouchAction;

          // Scroll to hash target after DOM settles
          setTimeout(() => scrollToHash(), 50);
        }
      };

      rafRef.current = requestAnimationFrame(advanceFrame);

      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
        if (!isCompleteRef.current) {
          document.body.style.overflow = originalOverflow;
          document.body.style.touchAction = originalTouchAction;
        }
      };
    }

    // --- Normal scroll-lock mode ---

    // Normalize wheel delta across browsers
    const normalizeDelta = (delta: number): number => {
      // Clamp to reasonable range to prevent jumps
      const clamped = Math.max(-100, Math.min(100, delta));
      // Apply sensitivity and convert to progress increment
      return clamped * sensitivity * 0.15;
    };

    // Update progress with smoothing
    const updateProgress = (delta: number) => {
      if (isCompleteRef.current) return;

      progressRef.current = Math.max(0, Math.min(100, progressRef.current + delta));

      // Request animation frame for smooth update
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        setProgress(progressRef.current);

        // Check for completion
        if (progressRef.current >= 100 && !isCompleteRef.current) {
          isCompleteRef.current = true;
          setIsComplete(true);
          setIsLocked(false);

          // Notify navbar that hero animation is complete
          window.dispatchEvent(new CustomEvent('heroAnimationComplete'));

          if (persistCompletion) {
            sessionStorage.setItem(storageKey, 'true');
          }

          // Restore body scroll
          document.body.style.overflow = originalOverflow;
          document.body.style.touchAction = originalTouchAction;
        }
      });
    };

    // Handle wheel events
    const handleWheel = (e: WheelEvent) => {
      if (isCompleteRef.current) return;

      e.preventDefault();
      e.stopPropagation();

      // deltaY is positive when scrolling down
      const delta = normalizeDelta(e.deltaY);
      updateProgress(delta);
    };

    // Handle touch events
    const handleTouchStart = (e: TouchEvent) => {
      if (isCompleteRef.current) return;

      touchStartY.current = e.touches[0].clientY;
      lastTouchY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isCompleteRef.current) return;

      e.preventDefault();
      e.stopPropagation();

      const currentY = e.touches[0].clientY;
      // Invert because swiping up (negative diff) should increase progress
      const delta = (lastTouchY.current - currentY) * sensitivity * 0.5;
      lastTouchY.current = currentY;

      updateProgress(delta);
    };

    const handleTouchEnd = () => {
      touchStartY.current = 0;
      lastTouchY.current = 0;
    };

    // Handle keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleteRef.current) return;

      // Never swallow keys meant for a form field or an open dialog: without
      // this, Space can't be typed into the inquiry modal while the hero is
      // still locked, and focused buttons can't be activated.
      const target = e.target as HTMLElement | null;
      if (target) {
        if (/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(target.tagName)) return;
        if (target.isContentEditable) return;
        if (target.closest('[role="dialog"]')) return;
      }

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
        case ' ': // Space
          e.preventDefault();
          updateProgress(5 * sensitivity);
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          updateProgress(-5 * sensitivity);
          break;
        case 'Escape':
          e.preventDefault();
          skipToEnd();
          break;
      }
    };

    // Block middle-click autoscroll activation
    const handleMouseDown = (e: MouseEvent) => {
      if (isCompleteRef.current) return;
      if (e.button === 1) {
        e.preventDefault();
      }
    };

    // Safety net: prevent any scroll position drift while locked
    const handleScroll = () => {
      if (isCompleteRef.current) return;
      window.scrollTo(0, 0);
    };

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('scroll', handleScroll);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Only restore if we locked it
      if (!isCompleteRef.current) {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      }
    };
  }, [sensitivity, persistCompletion, storageKey, skipToEnd, hashSkipDuration, scrollToHash]);

  return {
    progress,
    isComplete,
    isLocked,
    skipToEnd,
  };
}
