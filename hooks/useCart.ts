import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { RootState, AppDispatch } from '@/store';
import { clearCart } from '@/store/slices/cartSlice';
import { isCartEmpty } from '@/utils/cartUtils';
import { getCartItemsService, transformCartStateToRequest } from '@/services/cartService';
import { CartManufacturerDisplay } from '@/types/cart';

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart);
  const [isLoading, setIsLoading] = useState(false);
  const [cartData, setCartData] = useState<CartManufacturerDisplay[]>([]);

  // Estado básico
  const isEmpty = isCartEmpty(cart.manufacturers);

  // Obtener datos completos del carrito
  const fetchCartData = async () => {
    if (isEmpty) {
      setCartData([]);
      return [];
    }

    setIsLoading(true);
    try {
      const requestData = transformCartStateToRequest(cart.manufacturers);
      const data = await getCartItemsService(requestData);
      setCartData(data);
      return data;
    } catch (error) {
      console.error('Error fetching cart data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Acción principal
  const handleClearCart = () => {
    dispatch(clearCart());
    setCartData([]);
  };

  return {
    // Estado del carrito
    manufacturers: cart.manufacturers,
    lastUpdated: cart.lastUpdated,
    isEmpty,
    isLoading,
    cartData,
    
    // Acciones
    clearCart: handleClearCart,
    fetchCartData,
  };
};