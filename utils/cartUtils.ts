import { CartState } from '@/types/cart';

/**
 * Verifica si el carrito está vacío
 */
export const isCartEmpty = (users: Record<number, Record<string, any[]>>): boolean => {
  return Object.keys(users).length === 0;
};