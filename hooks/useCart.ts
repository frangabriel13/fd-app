import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { clearCart } from '@/store/slices/cartSlice';
import { isCartEmpty } from '@/utils/cartUtils';

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart);

  // Estado básico
  const isEmpty = isCartEmpty(cart.manufacturers);

  // Acción principal
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return {
    // Estado del carrito
    manufacturers: cart.manufacturers,
    lastUpdated: cart.lastUpdated,
    isEmpty,
    
    // Acción única
    clearCart: handleClearCart,
  };
};