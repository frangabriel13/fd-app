import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Typography } from './Typography';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md',
  className = '', 
  children, 
  loading = false,
  disabled,
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 active:bg-blue-700';
      case 'secondary':
        return 'bg-gray-600 active:bg-gray-700';
      case 'outline':
        return 'border-2 border-blue-600 bg-transparent active:bg-blue-50';
      case 'ghost':
        return 'bg-transparent active:bg-gray-100';
      default:
        return 'bg-blue-600 active:bg-blue-700';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 rounded-md';
      case 'md':
        return 'px-4 py-3 rounded-lg';
      case 'lg':
        return 'px-6 py-4 rounded-xl';
      default:
        return 'px-4 py-3 rounded-lg';
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') return 'text-blue-600';
    if (variant === 'ghost') return 'text-gray-700';
    return 'text-white';
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity 
      className={`
        ${getVariantStyles()} 
        ${getSizeStyles()} 
        ${isDisabled ? 'opacity-50' : ''} 
        items-center justify-center
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      <Typography 
        variant="button" 
        className={getTextColor()}
      >
        {loading ? 'Cargando...' : children}
      </Typography>
    </TouchableOpacity>
  );
};
