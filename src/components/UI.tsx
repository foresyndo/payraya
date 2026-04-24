import React from 'react';
import { motion } from 'motion/react';
import { COLORS } from '../constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'full';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-[16px] font-bold transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-btn';
  
  const variants = {
    primary: `bg-[#003A8F] text-white hover:bg-[#002A6B]`,
    secondary: `bg-[#FFC107] text-[#003A8F] hover:bg-[#EBB106]`,
    outline: `border border-[#f0f0f0] text-gray-700 bg-white hover:bg-gray-50`,
    ghost: `text-[#003A8F] bg-transparent hover:bg-[#003A8F]/5`,
    danger: `bg-[#E53935] text-white hover:bg-[#D32F2F]`
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    full: 'w-full py-4 text-lg'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Mohon Tunggu...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full bg-white border-2 rounded-xl py-3 px-4 outline-none transition-all
            ${icon ? 'pl-12' : 'pl-4'}
            ${error ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-[#003A8F]'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-[20px] shadow-btn border border-[#f0f0f0] p-5 ${className}`}>
      {children}
    </div>
  );
};
