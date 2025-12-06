import { CartState } from '@/types/cart';

/**
 * Verifica si el carrito está vacío
 */
export const isCartEmpty = (manufacturers: Record<number, Record<string, any[]>>): boolean => {
  return Object.keys(manufacturers).length === 0;
};