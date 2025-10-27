
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
      className={`bg-white dark:bg-white/5 dark:backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};