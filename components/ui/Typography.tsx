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
        return 'text-3xl font-mont-bold text-gray-900';
      case 'h2':
        return 'text-2xl font-mont-bold text-gray-900';
      case 'h3':
        return 'text-xl font-mont-medium text-gray-900';
      case 'body':
        return 'text-base font-mont-regular text-gray-700';
      case 'caption':
        return 'text-sm font-mont-light text-gray-500';
      case 'button':
        return 'text-base font-mont-medium text-white';
      default:
        return 'text-base font-mont-regular text-gray-700';
    }
  };

  return (
    <Text 
      className={`${getVariantStyles()} ${className}`}
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
