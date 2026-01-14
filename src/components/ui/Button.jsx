import React from 'react';

const variants = {
  primary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30',
  secondary: 'bg-white hover:bg-gray-100 text-purple-600 border-2 border-purple-200',
  ghost: 'bg-transparent hover:bg-purple-50 text-purple-600',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
};

const sizes = {
  sm: 'py-2 px-4 text-sm',
  md: 'py-3 px-6 text-base',
  lg: 'py-4 px-8 text-lg',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={`
        font-bold rounded-2xl transition-all active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
