import { useState, useEffect, useCallback } from 'react';

interface ParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down';
}

export const useParallax = (options: ParallaxOptions = {}) => {
  const { speed = 0.5, direction = 'up' } = options;
  const [offset, setOffset] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const multiplier = direction === 'up' ? -1 : 1;
    setOffset(scrollY * speed * multiplier);
  }, [speed, direction]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return offset;
};

export const useMultipleParallax = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getOffset = useCallback((speed: number, direction: 'up' | 'down' = 'up') => {
    const multiplier = direction === 'up' ? -1 : 1;
    return scrollY * speed * multiplier;
  }, [scrollY]);

  const getRotation = useCallback((speed: number) => {
    return scrollY * speed * 0.02;
  }, [scrollY]);

  const getScale = useCallback((baseScale: number, speed: number) => {
    const scaleChange = Math.sin(scrollY * speed * 0.001) * 0.1;
    return baseScale + scaleChange;
  }, [scrollY]);

  return { scrollY, getOffset, getRotation, getScale };
};
