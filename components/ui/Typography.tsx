import React from 'react';
import { Text, TextProps } from 'react-native';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'button';
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({ 
  variant = 'body', 
  className = '', 
  children, 
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return 'text-3xl font-mont-bold';
      case 'h2':
        return 'text-2xl font-mont-bold';
      case 'h3':
        return 'text-xl font-mont-medium';
      case 'body':
        return 'text-base font-mont-regular';
      case 'caption':
        return 'text-sm font-mont-light';
      case 'button':
        return 'text-base font-mont-medium';
      default:
        return 'text-base font-mont-regular';
    }
  };

  const getDefaultTextColor = () => {
    // Solo aplicar color por defecto si no se especifica className con color
    if (className && (className.includes('text-') || className.includes('color-'))) {
      return '';
    }
    
    switch (variant) {
      case 'h1':
      case 'h2':
      case 'h3':
        return 'text-gray-900';
      case 'body':
        return 'text-gray-700';
      case 'caption':
        return 'text-gray-500';
      case 'button':
        return 'text-white';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <Text 
      className={`${getVariantStyles()} ${getDefaultTextColor()} ${className}`}
      {...props}
    >
      {children}
    </Text>
  );
};

// Shortcuts para uso más fácil
export const H1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => 
  <Typography variant="h1" {...props} />;

export const H2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => 
  <Typography variant="h2" {...props} />;

export const H3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => 
  <Typography variant="h3" {...props} />;

export const BodyText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => 
  <Typography variant="body" {...props} />;

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => 
  <Typography variant="caption" {...props} />;