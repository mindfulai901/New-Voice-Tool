
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-6 py-3 font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0E1117]';
  
  const variantStyles = {
    primary: 'bg-[#00BFFF] text-white hover:bg-opacity-80 focus:ring-[#00BFFF] shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40',
    secondary: 'bg-[#2A2F3A] text-white hover:bg-opacity-80 focus:ring-[#4A505A]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
