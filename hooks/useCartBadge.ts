import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { RootState } from '@/store';

/**
 * Hook optimizado para obtener solo el número de fabricantes en el carrito
 * Se actualiza automáticamente cuando cambia el estado del carrito
 */
export const useCartBadge = () => {
  const manufacturers = useSelector((state: RootState) => state.cart.manufacturers);
  
  // Usar useMemo para optimizar el cálculo y evitar renders innecesarios
  const manufacturersCount = useMemo(() => {
    return Object.keys(manufacturers).length;
  }, [manufacturers]);

  return manufacturersCount;
};