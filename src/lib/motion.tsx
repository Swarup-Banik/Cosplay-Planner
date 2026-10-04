import React, { useEffect, useState } from 'react';

/**
 * Core Motion Foundation & Presets
 * Respects prefers-reduced-motion and provides 60fps hardware-accelerated animations.
 */

// Accessibility check for reduced motion
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

// Global hook checking reduced motion synchronously if needed
export function isReducedMotionPreferred(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Spring & Easing Presets
export const EASINGS = {
  // Cubic bezier curves
  easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeInOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',
  springSnappy: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  springGentle: 'cubic-bezier(0.16, 1, 0.3, 1)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

// Motion Variants Definition
export interface MotionVariant {
  initial: React.CSSProperties;
  animate: React.CSSProperties;
  exit?: React.CSSProperties;
  transition?: {
    duration?: number;
    delay?: number;
    ease?: string;
  };
}

export const VARIANTS = {
  fadeUp: {
    initial: { opacity: 0, transform: 'translateY(18px)' },
    animate: { opacity: 1, transform: 'translateY(0px)' },
    transition: { duration: 0.35, ease: EASINGS.springGentle }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.25, ease: EASINGS.smooth }
  },
  scalePop: {
    initial: { opacity: 0, transform: 'scale(0.92)' },
    animate: { opacity: 1, transform: 'scale(1)' },
    transition: { duration: 0.3, ease: EASINGS.springSnappy }
  },
  page: {
    initial: { opacity: 0, transform: 'translateY(8px)' },
    animate: { opacity: 1, transform: 'translateY(0px)' },
    exit: { opacity: 0, transform: 'translateY(-8px)' },
    transition: { duration: 0.28, ease: EASINGS.springGentle }
  }
};

/**
 * Animated Page Transition Container
 */
interface PageTransitionProps {
  children: React.ReactNode;
  pageKey: string;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, pageKey, className = '' }) => {
  const reducedMotion = usePrefersReducedMotion();
  const [mountedKey, setMountedKey] = useState(pageKey);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (pageKey !== mountedKey) {
      if (reducedMotion) {
        setMountedKey(pageKey);
        return;
      }
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setMountedKey(pageKey);
        setIsTransitioning(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [pageKey, mountedKey, reducedMotion]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      key={mountedKey}
      className={`transition-all duration-300 ease-out will-change-transform ${
        isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      } ${className}`}
    >
      {children}
    </div>
  );
};
