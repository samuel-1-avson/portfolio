import React from 'react';

interface RetroContainerProps {
  children: React.ReactNode;
  className?: string;
}

const RetroContainer: React.FC<RetroContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${className}`}>
      {children}
    </div>
  );
};

export default RetroContainer;
