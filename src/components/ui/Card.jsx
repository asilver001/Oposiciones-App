import React from 'react';

const variants = {
  default: 'bg-white border border-gray-100',
  elevated: 'bg-white shadow-lg',
  interactive: 'bg-white border-2 border-gray-100 hover:border-brand-300 cursor-pointer',
  gradient: 'bg-brand-600 text-white',
};

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={`
        rounded-2xl
        ${variants[variant]}
        ${paddings[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
