import React, { createContext, useContext } from 'react';
import { useCartAnimation } from '@/hooks/useCartAnimation';

interface CartAnimationContextType {
  isAnimating: boolean;
  triggerAnimation: () => void;
}

const CartAnimationContext = createContext<CartAnimationContextType | undefined>(undefined);

export const CartAnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cartAnimation = useCartAnimation();

  return (
    <CartAnimationContext.Provider value={cartAnimation}>
      {children}
    </CartAnimationContext.Provider>
  );
};

export const useCartAnimationContext = () => {
  const context = useContext(CartAnimationContext);
  if (context === undefined) {
    throw new Error('useCartAnimationContext must be used within a CartAnimationProvider');
  }
  return context;
};