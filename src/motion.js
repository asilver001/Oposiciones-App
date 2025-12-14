/**
 * Motion System - Oposita Smart
 *
 * Utilities for consistent animations across the app.
 * Only uses transform + opacity (GPU accelerated).
 * Respects prefers-reduced-motion.
 */

// ============================================
// DURATIONS (in ms)
// ============================================
export const duration = {
  instant: 0,
  fast: 100,      // Press feedback
  normal: 200,    // Standard interactions
  smooth: 300,    // Modal/sheet transitions
  slow: 400,      // Entrance animations
};

// ============================================
// EASINGS (cubic-bezier)
// ============================================
export const easing = {
  // Standard easings
  linear: 'linear',
  easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',      // Decelerate
  easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',         // Accelerate
  easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',    // Standard

  // Spring-like (slight overshoot for organic feel)
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',    // Bouncy return
  springGentle: 'cubic-bezier(0.22, 1, 0.36, 1)', // Subtle overshoot

  // Material Design
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',       // Expressive
  standard: 'cubic-bezier(0.2, 0, 0, 1)',         // Default
};

// ============================================
// REDUCED MOTION DETECTION
// ============================================

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get motion-safe value
 * Returns reducedValue if user prefers reduced motion
 * @param {any} fullValue - Value for full motion
 * @param {any} reducedValue - Value for reduced motion
 */
export const motionSafe = (fullValue, reducedValue) => {
  return prefersReducedMotion() ? reducedValue : fullValue;
};

// ============================================
// TRANSITION HELPERS
// ============================================

/**
 * Build transition string for inline styles
 * @param {Object} options
 * @param {string[]} options.properties - CSS properties to animate
 * @param {number} options.duration - Duration in ms
 * @param {string} options.easing - Easing function
 * @returns {string}
 */
export const buildTransition = ({ properties = ['all'], duration: dur = duration.normal, easing: ease = easing.easeOut }) => {
  return properties.map(prop => `${prop} ${dur}ms ${ease}`).join(', ');
};

/**
 * Get standard press feedback styles
 * @param {boolean} isPressed
 * @param {Object} options
 * @returns {Object} - Inline style object
 */
export const getPressStyle = (isPressed, { scale = 0.98, opacity = 0.92 } = {}) => {
  if (prefersReducedMotion()) {
    return {
      opacity: isPressed ? opacity : 1,
      transition: `opacity ${duration.fast}ms ${easing.easeOut}`,
    };
  }

  return {
    transform: isPressed ? `scale(${scale})` : 'scale(1)',
    opacity: isPressed ? opacity : 1,
    transition: isPressed
      ? buildTransition({ properties: ['transform', 'opacity'], duration: duration.fast, easing: easing.easeOut })
      : buildTransition({ properties: ['transform', 'opacity'], duration: duration.normal, easing: easing.spring }),
  };
};

// ============================================
// SHEET / MODAL ANIMATION PRESETS
// ============================================

/**
 * Get sheet/modal animation styles
 * @param {boolean} isOpen
 * @param {Object} options
 * @returns {Object} - { backdrop: styleObj, panel: styleObj }
 */
export const getSheetStyles = (isOpen, {
  translateY = 20,
  openDuration = duration.smooth,
  closeDuration = duration.normal
} = {}) => {
  const reduced = prefersReducedMotion();

  const backdrop = {
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
    transition: reduced
      ? `opacity ${duration.fast}ms ${easing.easeOut}`
      : isOpen
        ? `opacity ${openDuration}ms ${easing.springGentle}`
        : `opacity ${closeDuration}ms ${easing.easeIn}`,
  };

  const panel = reduced
    ? {
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: `opacity ${duration.fast}ms ${easing.easeOut}`,
      }
    : {
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0)' : `translateY(${translateY}px)`,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: isOpen
          ? buildTransition({ properties: ['opacity', 'transform'], duration: openDuration, easing: easing.springGentle })
          : buildTransition({ properties: ['opacity', 'transform'], duration: closeDuration, easing: easing.easeIn }),
      };

  return { backdrop, panel };
};

// ============================================
// ENTRANCE ANIMATION HELPERS
// ============================================

/**
 * Get entrance animation style (fade + slide up)
 * @param {boolean} isVisible
 * @param {Object} options
 * @returns {Object}
 */
export const getEntranceStyle = (isVisible, {
  translateY = 8,
  duration: dur = duration.smooth,
  delay = 0,
} = {}) => {
  if (prefersReducedMotion()) {
    return {
      opacity: isVisible ? 1 : 0,
      transition: `opacity ${duration.fast}ms ${easing.easeOut}`,
      transitionDelay: `${delay}ms`,
    };
  }

  return {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : `translateY(${translateY}px)`,
    transition: buildTransition({ properties: ['opacity', 'transform'], duration: dur, easing: easing.springGentle }),
    transitionDelay: `${delay}ms`,
  };
};

// ============================================
// REACT HOOKS (if using React)
// ============================================

/**
 * Hook for press state management
 * Returns handlers and style for press animation
 *
 * Usage:
 * const { pressHandlers, pressStyle } = usePress({ onPress: () => doSomething() });
 * <button {...pressHandlers} style={pressStyle}>Click me</button>
 */
export const createPressHandlers = (onPress, { scale = 0.98, opacity = 0.92 } = {}) => {
  let isPressed = false;

  const setPressed = (pressed) => {
    isPressed = pressed;
  };

  return {
    onPointerDown: (e) => {
      e.preventDefault();
      setPressed(true);
    },
    onPointerUp: () => {
      if (isPressed) {
        setPressed(false);
        onPress?.();
      }
    },
    onPointerLeave: () => setPressed(false),
    onPointerCancel: () => setPressed(false),
  };
};

// ============================================
// CSS CLASS HELPERS (for Tailwind)
// ============================================

/**
 * Standard press classes for Tailwind
 * Use these in className for consistent press feedback
 */
export const pressClasses = {
  // Primary buttons (CTA)
  primary: 'active:scale-[0.98] transition-transform duration-100',

  // Secondary buttons
  secondary: 'active:scale-95 transition-transform duration-100',

  // Cards/options
  card: 'active:scale-[0.98] transition-transform duration-75',

  // Icon buttons
  icon: 'active:scale-90 transition-transform duration-100',

  // Text buttons
  text: 'active:opacity-70 transition-opacity duration-100',
};

/**
 * Reduced motion safe classes
 * Removes scale animations, keeps opacity
 */
export const reducedMotionClasses = 'motion-reduce:transform-none motion-reduce:transition-opacity';
