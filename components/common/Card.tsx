
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-lg transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};
