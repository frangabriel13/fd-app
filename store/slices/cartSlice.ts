import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState, AddToCartPayload, UpdateCartItemPayload, RemoveCartItemPayload } from '@/types/cart';

const initialState: CartState = {
  manufacturers: {},
  lastUpdated: new Date().toISOString(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Agrega un item al carrito o incrementa su cantidad
     */
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const { manufacturerId, productId, inventoryId, quantity } = action.payload;
      
      // Si no existe el fabricante, lo creamos
      if (!state.manufacturers[manufacturerId]) {
        state.manufacturers[manufacturerId] = {};
      }
      
      // Si no existe el producto, lo creamos
      if (!state.manufacturers[manufacturerId][productId]) {
        state.manufacturers[manufacturerId][productId] = [];
      }
      
      // Buscar si ya existe este inventory
      const existingInventoryIndex = state.manufacturers[manufacturerId][productId].findIndex(
        item => item.inventoryId === inventoryId
      );
      
      if (existingInventoryIndex >= 0) {
        // Si existe, incrementamos la cantidad
        state.manufacturers[manufacturerId][productId][existingInventoryIndex].quantity += quantity;
      } else {
        // Si no existe, lo agregamos
        state.manufacturers[manufacturerId][productId].push({ inventoryId, quantity });
      }
      
      state.lastUpdated = new Date().toISOString();
    },

    /**
     * Actualiza la cantidad de un item específico
     */
    updateCartItem: (state, action: PayloadAction<UpdateCartItemPayload>) => {
      const { manufacturerId, productId, inventoryId, quantity } = action.payload;
      
      if (state.manufacturers[manufacturerId]?.[productId]) {
        const inventoryIndex = state.manufacturers[manufacturerId][productId].findIndex(
          item => item.inventoryId === inventoryId
        );
        
        if (inventoryIndex >= 0) {
          if (quantity <= 0) {
            // Si la cantidad es 0 o menor, eliminamos el item
            state.manufacturers[manufacturerId][productId].splice(inventoryIndex, 1);
            
            // Si no quedan inventarios en el producto, eliminamos el producto
            if (state.manufacturers[manufacturerId][productId].length === 0) {
              delete state.manufacturers[manufacturerId][productId];
              
              // Si no quedan productos en el fabricante, eliminamos el fabricante
              if (Object.keys(state.manufacturers[manufacturerId]).length === 0) {
                delete state.manufacturers[manufacturerId];
              }
            }
          } else {
            // Actualizamos la cantidad
            state.manufacturers[manufacturerId][productId][inventoryIndex].quantity = quantity;
          }
        }
      }
      
      state.lastUpdated = new Date().toISOString();
    },

    /**
     * Elimina un item específico del carrito
     */
    removeFromCart: (state, action: PayloadAction<RemoveCartItemPayload>) => {
      const { manufacturerId, productId, inventoryId } = action.payload;
      
      if (state.manufacturers[manufacturerId]?.[productId]) {
        // Filtrar para eliminar el inventory específico
        state.manufacturers[manufacturerId][productId] = state.manufacturers[manufacturerId][productId].filter(
          item => item.inventoryId !== inventoryId
        );
        
        // Si no quedan inventarios en el producto, eliminamos el producto
        if (state.manufacturers[manufacturerId][productId].length === 0) {
          delete state.manufacturers[manufacturerId][productId];
          
          // Si no quedan productos en el fabricante, eliminamos el fabricante
          if (Object.keys(state.manufacturers[manufacturerId]).length === 0) {
            delete state.manufacturers[manufacturerId];
          }
        }
      }
      
      state.lastUpdated = new Date().toISOString();
    },

    /**
     * Limpia todo el carrito
     */
    clearCart: (state) => {
      state.manufacturers = {};
      state.lastUpdated = new Date().toISOString();
    },
  },
});

export const {
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;