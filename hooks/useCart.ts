import { useSelector, useDispatch } from 'react-redux';
import { useState, useCallback } from 'react';
import { RootState, AppDispatch } from '@/store';
import { addToCart, updateCartItem, removeFromCart, removeManufacturer, clearCart } from '@/store/slices/cartSlice';
import { isCartEmpty } from '@/utils/cartUtils';
import { getCartItemsService, transformCartStateToRequest } from '@/services/cartService';
import { CartManufacturerDisplay, AddToCartPayload, UpdateCartItemPayload, RemoveCartItemPayload } from '@/types/cart';

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

  // Agregar al carrito
  const handleAddToCart = (payload: AddToCartPayload) => {
    dispatch(addToCart(payload));
  };

  // Actualizar cantidad
  const handleUpdateCartItem = (payload: UpdateCartItemPayload) => {
    dispatch(updateCartItem(payload));
  };

  // Eliminar del carrito
  const handleRemoveFromCart = (payload: RemoveCartItemPayload) => {
    dispatch(removeFromCart(payload));
  };

  // Eliminar fabricante completo
  const handleRemoveManufacturer = (manufacturerId: number) => {
    dispatch(removeManufacturer({ manufacturerId }));
    // Actualizar cartData eliminando el fabricante
    setCartData(prevData => prevData.filter(item => item.manufacturerId !== manufacturerId));
  };

  // Obtener cantidad de un item específico
  const getItemQuantity = useCallback((manufacturerId: number, productId: string, inventoryId: number): number => {
    const product = cart.manufacturers[manufacturerId]?.[productId];
    if (!product) return 0;
    
    const inventory = product.find(item => item.inventoryId === inventoryId);
    return inventory?.quantity || 0;
  }, [cart.manufacturers]);

  // Verificar si un item está en el carrito
  const isItemInCart = useCallback((manufacturerId: number, productId: string, inventoryId: number): boolean => {
    return getItemQuantity(manufacturerId, productId, inventoryId) > 0;
  }, [getItemQuantity]);

  // Obtener total de items en el carrito
  const getTotalItems = (): number => {
    return Object.values(cart.manufacturers).reduce((total, manufacturer) => {
      return total + Object.values(manufacturer).reduce((manufacturerTotal, product) => {
        return manufacturerTotal + product.reduce((productTotal, inventory) => {
          return productTotal + inventory.quantity;
        }, 0);
      }, 0);
    }, 0);
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
    addToCart: handleAddToCart,
    updateCartItem: handleUpdateCartItem,
    removeFromCart: handleRemoveFromCart,
    removeManufacturer: handleRemoveManufacturer,
    clearCart: handleClearCart,
    fetchCartData,
    
    // Utilidades
    getItemQuantity,
    isItemInCart,
    getTotalItems,
  };
};