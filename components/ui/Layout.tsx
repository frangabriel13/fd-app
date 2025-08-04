import React from 'react';
import { View, ViewProps } from 'react-native';

interface SpacerProps extends ViewProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  direction?: 'horizontal' | 'vertical';
}

export const Spacer: React.FC<SpacerProps> = ({ 
  size = 'md', 
  direction = 'vertical',
  className = '',
  ...props 
}) => {
  const getSizeStyles = () => {
    const isHorizontal = direction === 'horizontal';
    
    switch (size) {
      case 'xs':
        return isHorizontal ? 'w-1' : 'h-1';
      case 'sm':
        return isHorizontal ? 'w-2' : 'h-2';
      case 'md':
        return isHorizontal ? 'w-4' : 'h-4';
      case 'lg':
        return isHorizontal ? 'w-6' : 'h-6';
      case 'xl':
        return isHorizontal ? 'w-8' : 'h-8';
      case '2xl':
        return isHorizontal ? 'w-12' : 'h-12';
      default:
        return isHorizontal ? 'w-4' : 'h-4';
    }
  };

  return (
    <View 
      className={`${getSizeStyles()} ${className}`}
      {...props}
    />
  );
};

// Layout containers
interface ContainerProps extends ViewProps {
  type?: 'page' | 'section' | 'card';
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ 
  type = 'section',
  className = '',
  children,
  ...props 
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'page':
        return 'flex-1 bg-gray-50 px-4 py-6';
      case 'section':
        return 'py-4';
      case 'card':
        return 'bg-white rounded-lg p-4 shadow-sm';
      default:
        return 'py-4';
    }
  };

  return (
    <View 
      className={`${getTypeStyles()} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};
