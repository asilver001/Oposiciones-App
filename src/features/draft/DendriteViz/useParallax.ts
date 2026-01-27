/**
 * useParallax Hook
 *
 * Creates a smooth parallax effect based on mouse position.
 * Nodes at different Z-depths move at different rates.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { ParallaxConfig } from './types';
import { DEFAULT_PARALLAX } from './types';

interface ParallaxState {
  offsetX: number;
  offsetY: number;
  targetX: number;
  targetY: number;
}

interface UseParallaxOptions {
  containerRef: React.RefObject<HTMLElement>;
  config?: Partial<ParallaxConfig>;
}

interface UseParallaxReturn {
  offsetX: number;
  offsetY: number;
  getNodeOffset: (z: number, minZ: number, maxZ: number) => { x: number; y: number };
}

export function useParallax({
  containerRef,
  config,
}: UseParallaxOptions): UseParallaxReturn {
  const settings = { ...DEFAULT_PARALLAX, ...config };

  const [state, setState] = useState<ParallaxState>({
    offsetX: 0,
    offsetY: 0,
    targetX: 0,
    targetY: 0,
  });

  const animationRef = useRef<number>(0);
  const isActiveRef = useRef(true);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!settings.enabled || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate mouse offset from center (-1 to 1)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const normalizedX = (mouseX - centerX) / centerX;
    const normalizedY = (mouseY - centerY) / centerY;

    // Set target offset
    setState(prev => ({
      ...prev,
      targetX: normalizedX * settings.strength,
      targetY: normalizedY * settings.strength,
    }));
  }, [containerRef, settings.enabled, settings.strength]);

  // Handle mouse leave - return to center
  const handleMouseLeave = useCallback(() => {
    setState(prev => ({
      ...prev,
      targetX: 0,
      targetY: 0,
    }));
  }, []);

  // Smooth animation loop
  const animate = useCallback(() => {
    if (!isActiveRef.current) return;

    setState(prev => {
      const dx = prev.targetX - prev.offsetX;
      const dy = prev.targetY - prev.offsetY;

      // Smooth interpolation
      const newOffsetX = prev.offsetX + dx * settings.smoothing;
      const newOffsetY = prev.offsetY + dy * settings.smoothing;

      // Only update if change is significant
      if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
        return prev;
      }

      return {
        ...prev,
        offsetX: newOffsetX,
        offsetY: newOffsetY,
      };
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [settings.smoothing]);

  // Calculate offset for a node based on its Z depth
  // Nodes further back (higher Z) move less, nodes in front move more
  const getNodeOffset = useCallback((z: number, minZ: number, maxZ: number) => {
    if (!settings.enabled) return { x: 0, y: 0 };

    // Normalize Z to 0-1 range (0 = back, 1 = front)
    const zRange = maxZ - minZ || 1;
    const normalizedZ = (z - minZ) / zRange;

    // Invert so nodes in back (low Z) move less
    // Parallax factor: 0.3 for back nodes, 1.0 for front nodes
    const parallaxFactor = 0.3 + normalizedZ * 0.7;

    return {
      x: state.offsetX * parallaxFactor,
      y: state.offsetY * parallaxFactor,
    };
  }, [state.offsetX, state.offsetY, settings.enabled]);

  // Setup event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !settings.enabled) return;

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    isActiveRef.current = true;
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      isActiveRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [containerRef, settings.enabled, handleMouseMove, handleMouseLeave, animate]);

  return {
    offsetX: state.offsetX,
    offsetY: state.offsetY,
    getNodeOffset,
  };
}

export default useParallax;
