/**
 * Motion Components - Oposita Smart
 *
 * Reusable animated components using the motion system.
 */

import React, { useState, useEffect, useRef } from 'react';
import { getSheetStyles, getPressStyle, prefersReducedMotion, duration, easing } from '../motion';

// ============================================
// useCountUp HOOK
// ============================================

/**
 * Hook for count-up animation on numbers
 *
 * @param {number} end - Target number to count to
 * @param {Object} options
 * @param {number} options.duration - Animation duration in ms (default 600)
 * @param {number} options.start - Starting number (default 0)
 * @param {boolean} options.enabled - Enable/disable animation (default true)
 * @returns {number} - Current animated value
 *
 * @example
 * const animatedCount = useCountUp(100, { duration: 800 });
 * <span>{animatedCount}</span>
 */
export const useCountUp = (end, { duration: dur = 600, start = 0, enabled = true } = {}) => {
  const [value, setValue] = useState(enabled ? start : end);
  const frameRef = useRef();
  const startTimeRef = useRef();

  useEffect(() => {
    // Skip animation if reduced motion preferred or disabled
    if (prefersReducedMotion() || !enabled) {
      setValue(end);
      return;
    }

    // Reset to start when end changes
    setValue(start);
    startTimeRef.current = null;

    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / dur, 1);

      // Ease out quad for smooth deceleration
      const easeOutQuad = 1 - Math.pow(1 - progress, 2);
      const current = Math.round(start + (end - start) * easeOutQuad);

      setValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, dur, start, enabled]);

  return value;
};

// ============================================
// usePress HOOK
// ============================================

/**
 * Hook for press animation on buttons
 *
 * @param {Object} options
 * @param {Function} options.onPress - Callback when press completes
 * @param {number} options.scale - Scale when pressed (default 0.98)
 * @param {number} options.opacity - Opacity when pressed (default 0.92)
 * @param {boolean} options.disabled - Disable interactions
 * @returns {{ isPressed: boolean, pressHandlers: Object, pressStyle: Object }}
 *
 * @example
 * const { pressHandlers, pressStyle } = usePress({ onPress: handleClick });
 * <button {...pressHandlers} style={pressStyle}>Click me</button>
 */
export const usePress = ({
  onPress,
  scale = 0.98,
  opacity = 0.92,
  disabled = false,
} = {}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerDown = (e) => {
    if (disabled) return;
    e.preventDefault();
    setIsPressed(true);
  };

  const handlePointerUp = () => {
    if (disabled) return;
    if (isPressed) {
      setIsPressed(false);
      onPress?.();
    }
  };

  const handlePointerLeave = () => {
    setIsPressed(false);
  };

  const handlePointerCancel = () => {
    setIsPressed(false);
  };

  const pressHandlers = {
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerLeave: handlePointerLeave,
    onPointerCancel: handlePointerCancel,
  };

  const pressStyle = getPressStyle(isPressed, { scale, opacity });

  return {
    isPressed,
    pressHandlers,
    pressStyle,
  };
};

// ============================================
// SHEET COMPONENT (Persistent Modal)
// ============================================

/**
 * Persistent Sheet/Modal component
 *
 * Always mounted, uses transform/opacity for animation.
 * Respects prefers-reduced-motion.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls open/close state
 * @param {Function} props.onClose - Called when backdrop clicked or close requested
 * @param {React.ReactNode} props.children - Sheet content
 * @param {string} props.className - Additional classes for the panel
 * @param {boolean} props.closeOnBackdrop - Close when clicking backdrop (default true)
 * @param {number} props.translateY - Slide distance in px (default 20)
 *
 * @example
 * <Sheet isOpen={showModal} onClose={() => setShowModal(false)}>
 *   <div>Modal content here</div>
 * </Sheet>
 */
export const Sheet = ({
  isOpen,
  onClose,
  children,
  className = '',
  closeOnBackdrop = true,
  translateY = 20,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Sync visual state with isOpen using rAF for smooth transition
  useEffect(() => {
    if (isOpen) {
      // Ensure browser paints closed state first
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const { backdrop, panel } = getSheetStyles(isVisible, { translateY });

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget && isVisible) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
      style={backdrop}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto shadow-2xl ${className}`}
        style={panel}
      >
        {children}
      </div>
    </div>
  );
};

// ============================================
// ANIMATED BUTTON COMPONENT
// ============================================

/**
 * Button with built-in press animation
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {Function} props.onClick
 * @param {string} props.className
 * @param {boolean} props.disabled
 * @param {number} props.scale - Press scale (default 0.98)
 * @param {string} props.type - Button type
 *
 * @example
 * <AnimatedButton onClick={handleSubmit} className="bg-purple-600 text-white">
 *   Continuar
 * </AnimatedButton>
 */
export const AnimatedButton = ({
  children,
  onClick,
  className = '',
  disabled = false,
  scale = 0.98,
  type = 'button',
  ...props
}) => {
  const { pressHandlers, pressStyle } = usePress({
    onPress: onClick,
    scale,
    disabled,
  });

  return (
    <button
      type={type}
      disabled={disabled}
      className={className}
      style={pressStyle}
      {...pressHandlers}
      {...props}
    >
      {children}
    </button>
  );
};

// ============================================
// ANIMATED OPTION CARD
// ============================================

/**
 * Selectable option card with press feedback
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {Function} props.onSelect
 * @param {boolean} props.selected
 * @param {boolean} props.disabled
 * @param {string} props.className
 *
 * @example
 * <OptionCard onSelect={() => setChoice('a')} selected={choice === 'a'}>
 *   Option A content
 * </OptionCard>
 */
export const OptionCard = ({
  children,
  onSelect,
  selected = false,
  disabled = false,
  className = '',
}) => {
  const { pressHandlers, pressStyle } = usePress({
    onPress: onSelect,
    scale: 0.98,
    disabled,
  });

  const baseClasses = 'w-full text-left p-4 rounded-xl border transition-colors';
  const stateClasses = selected
    ? 'border-purple-500 bg-purple-50'
    : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-gray-50';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      type="button"
      disabled={disabled}
      className={`${baseClasses} ${stateClasses} ${disabledClasses} ${className}`}
      style={pressStyle}
      {...pressHandlers}
    >
      {children}
    </button>
  );
};

// ============================================
// ENTRANCE WRAPPER
// ============================================

/**
 * Wrapper that animates children on mount
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number} props.delay - Delay in ms (for stagger)
 * @param {number} props.translateY - Slide distance
 * @param {string} props.className
 *
 * @example
 * <EntranceWrapper delay={100}>
 *   <div>This fades and slides in</div>
 * </EntranceWrapper>
 */
export const EntranceWrapper = ({
  children,
  delay = 0,
  translateY = 8,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const reduced = prefersReducedMotion();

  const style = reduced
    ? {
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${duration.fast}ms ${easing.easeOut}`,
        transitionDelay: `${delay}ms`,
      }
    : {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : `translateY(${translateY}px)`,
        transition: `opacity ${duration.smooth}ms ${easing.springGentle}, transform ${duration.smooth}ms ${easing.springGentle}`,
        transitionDelay: `${delay}ms`,
      };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

// ============================================
// COUNT UP COMPONENT
// ============================================

/**
 * Animated number that counts up from 0 to value
 *
 * @param {Object} props
 * @param {number} props.value - Target number
 * @param {number} props.duration - Animation duration in ms
 * @param {string} props.suffix - Optional suffix (e.g., "%")
 * @param {string} props.className - Additional classes
 *
 * @example
 * <CountUp value={85} suffix="%" className="text-3xl font-bold" />
 */
export const CountUp = ({
  value,
  duration: dur = 600,
  suffix = '',
  className = '',
}) => {
  const animatedValue = useCountUp(value, { duration: dur });

  return (
    <span className={className}>
      {animatedValue}{suffix}
    </span>
  );
};

export default {
  usePress,
  useCountUp,
  Sheet,
  AnimatedButton,
  OptionCard,
  EntranceWrapper,
  CountUp,
};
