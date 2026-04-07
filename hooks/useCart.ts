import { useSelector, useDispatch } from 'react-redux';
import { useState, useCallback, useRef } from 'react';
import { RootState, AppDispatch } from '@/store';
import { addToCart, updateCartItem, removeFromCart, removeManufacturer, clearCart } from '@/store/slices/cartSlice';
import { isCartEmpty } from '@/utils/cartUtils';
import { getCartItemsService, transformCartStateToRequest } from '@/services/cartService';
import { CartManufacturerDisplay, AddToCartPayload, UpdateCartItemPayload, RemoveCartItemPayload } from '@/types/cart';
import { productInstance } from '@/services/axiosConfig';

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart);
  const [isLoading, setIsLoading] = useState(false);
  const [cartData, setCartData] = useState<CartManufacturerDisplay[]>([]);

  // Ref que siempre apunta al estado actual del carrito
  const cartRef = useRef(cart);
  cartRef.current = cart;

  // Estado básico
  const isEmpty = isCartEmpty(cart.manufacturers);

  // Obtener datos completos del carrito (estable, lee siempre el estado más reciente via ref)
  const fetchCartData = useCallback(async () => {
    const currentCart = cartRef.current;
    const currentIsEmpty = isCartEmpty(currentCart.manufacturers);

    if (currentIsEmpty) {
      setCartData([]);
      return [];
    }

    setIsLoading(true);
    try {
      const requestData = transformCartStateToRequest(currentCart.manufacturers);
      const data = await getCartItemsService(requestData);
      setCartData(data);
      return data;
    } catch (error) {
      console.error('Error fetching cart data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Agregar al carrito
  const handleAddToCart = (payload: AddToCartPayload) => {
    // Verificar si el producto ya existe en el carrito (cualquier variante)
    const productAlreadyInCart = cart.manufacturers[payload.manufacturerId]?.[payload.productId]?.length > 0;

    dispatch(addToCart(payload));

    // Registrar estadística solo la primera vez que el producto entra al carrito
    if (!productAlreadyInCart) {
      productInstance.post('/stats/cart', { productId: payload.productId }).catch(() => {});
    }
  };

  // Actualizar cantidad (con actualización optimista del cartData)
  const handleUpdateCartItem = (payload: UpdateCartItemPayload) => {
    dispatch(updateCartItem(payload));
    setCartData(prev => prev.map(mfr => {
      if (mfr.manufacturerId !== payload.manufacturerId) return mfr;
      const updatedItems = payload.quantity <= 0
        ? mfr.items.filter(item => !(item.productId === payload.productId && item.inventoryId === payload.inventoryId))
        : mfr.items.map(item => {
            if (item.productId === payload.productId && item.inventoryId === payload.inventoryId) {
              return { ...item, quantity: payload.quantity };
            }
            return item;
          });
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.salePrice || item.price || 0) * item.quantity, 0);
      return { ...mfr, items: updatedItems, totalItems, subtotal };
    }).filter(mfr => mfr.items.length > 0));
  };

  // Eliminar del carrito (con actualización optimista del cartData)
  const handleRemoveFromCart = (payload: RemoveCartItemPayload) => {
    dispatch(removeFromCart(payload));
    setCartData(prev => prev.map(mfr => {
      if (mfr.manufacturerId !== payload.manufacturerId) return mfr;
      const updatedItems = mfr.items.filter(item =>
        !(item.productId === payload.productId && item.inventoryId === payload.inventoryId)
      );
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.salePrice || item.price || 0) * item.quantity, 0);
      return { ...mfr, items: updatedItems, totalItems, subtotal };
    }).filter(mfr => mfr.items.length > 0));
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