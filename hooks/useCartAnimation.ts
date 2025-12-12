import { useState, useCallback } from 'react';

export const useCartAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerAnimation = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 600); // Duración de la animación
  }, []);

  return {
    isAnimating,
    triggerAnimation,
  };
};