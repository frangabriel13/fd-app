import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CartState,
  CartInventoryItem,
  AddToCartPayload,
  UpdateCartItemPayload,
  RemoveCartItemPayload
} from '@/types/cart';
import {
  findInventoryItem,
  calculateTotalItems,
  validateQuantity
} from '@/utils/cartUtils';

const initialState: CartState = {
  manufacturers: {},
  lastUpdated: new Date().toISOString(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Añade un producto al carrito
     */
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const { manufacturerId, productId, inventoryId, quantity } = action.payload;

      // Validar cantidad
      if (!validateQuantity(quantity)) {
        console.warn('Cantidad inválida');
        return;
      }

      // Inicializar manufacturer si no existe
      if (!state.manufacturers[manufacturerId]) {
        state.manufacturers[manufacturerId] = {};
      }

      // Inicializar producto si no existe
      if (!state.manufacturers[manufacturerId][productId]) {
        state.manufacturers[manufacturerId][productId] = [];
      }

      const inventories = state.manufacturers[manufacturerId][productId];
      const existingInventory = findInventoryItem(inventories, inventoryId);

      if (existingInventory) {
        // Si el inventario ya existe, sumar la cantidad
        existingInventory.quantity += quantity;
      } else {
        // Añadir nuevo inventario
        inventories.push({
          inventoryId,
          quantity,
        });
      }

      state.lastUpdated = new Date().toISOString();
    },

    /**
     * Actualiza la cantidad de un item específico
     */
    updateCartItem: (state, action: PayloadAction<UpdateCartItemPayload>) => {
      const { manufacturerId, productId, inventoryId, quantity } = action.payload;
      
      const manufacturer = state.manufacturers[manufacturerId];
      if (!manufacturer) return;

      const inventories = manufacturer[productId];
      if (!inventories) return;

      const existingInventory = findInventoryItem(inventories, inventoryId);
      if (!existingInventory) return;

      if (quantity <= 0) {
        // Si la cantidad es 0 o negativa, eliminar el inventario
        const index = inventories.findIndex(inv => inv.inventoryId === inventoryId);
        if (index > -1) {
          inventories.splice(index, 1);
        }

        // Si no quedan inventarios del producto, eliminar el producto
        if (inventories.length === 0) {
          delete manufacturer[productId];
        }

        // Si no quedan productos del manufacturer, eliminar el manufacturer
        if (Object.keys(manufacturer).length === 0) {
          delete state.manufacturers[manufacturerId];
        }
      } else if (validateQuantity(quantity)) {
        existingInventory.quantity = quantity;
      } else {
        console.warn('Cantidad inválida');
        return;
      }

      state.lastUpdated = new Date().toISOString();
    },

    /**
     * Elimina un item específico del carrito
     */
    removeCartItem: (state, action: PayloadAction<RemoveCartItemPayload>) => {
      const { manufacturerId, productId, inventoryId } = action.payload;
      
      const manufacturer = state.manufacturers[manufacturerId];
      if (!manufacturer) return;

      const inventories = manufacturer[productId];
      if (!inventories) return;

      // Eliminar el inventario específico
      const index = inventories.findIndex(inv => inv.inventoryId === inventoryId);
      if (index > -1) {
        inventories.splice(index, 1);
      }

      // Si no quedan inventarios del producto, eliminar el producto
      if (inventories.length === 0) {
        delete manufacturer[productId];
      }

      // Si no quedan productos del manufacturer, eliminar el manufacturer
      if (Object.keys(manufacturer).length === 0) {
        delete state.manufacturers[manufacturerId];
      }

      state.lastUpdated = new Date().toISOString();
    },

    /**
     * Elimina todos los productos de un manufacturer
     */
    removeManufacturer: (state, action: PayloadAction<number>) => {
      const manufacturerId = action.payload;
      delete state.manufacturers[manufacturerId];
      state.lastUpdated = new Date().toISOString();
    },

    /**
     * Elimina un producto completo (todos sus inventarios)
     */
    removeProduct: (state, action: PayloadAction<{ manufacturerId: number; productId: string }>) => {
      const { manufacturerId, productId } = action.payload;
      
      const manufacturer = state.manufacturers[manufacturerId];
      if (!manufacturer) return;

      delete manufacturer[productId];

      // Si no quedan productos del manufacturer, eliminar el manufacturer
      if (Object.keys(manufacturer).length === 0) {
        delete state.manufacturers[manufacturerId];
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

    /**
     * Incrementa la cantidad de un item en 1
     */
    incrementItem: (state, action: PayloadAction<RemoveCartItemPayload>) => {
      const { manufacturerId, productId, inventoryId } = action.payload;
      
      const manufacturer = state.manufacturers[manufacturerId];
      if (!manufacturer) return;

      const inventories = manufacturer[productId];
      if (!inventories) return;

      const existingInventory = findInventoryItem(inventories, inventoryId);
      if (!existingInventory) return;

      existingInventory.quantity += 1;
      state.lastUpdated = new Date().toISOString();
    },

    /**
     * Decrementa la cantidad de un item en 1
     */
    decrementItem: (state, action: PayloadAction<RemoveCartItemPayload>) => {
      const { manufacturerId, productId, inventoryId } = action.payload;
      
      const manufacturer = state.manufacturers[manufacturerId];
      if (!manufacturer) return;

      const inventories = manufacturer[productId];
      if (!inventories) return;

      const existingInventory = findInventoryItem(inventories, inventoryId);
      if (!existingInventory) return;

      if (existingInventory.quantity > 1) {
        existingInventory.quantity -= 1;
        state.lastUpdated = new Date().toISOString();
      } else {
        // Si la cantidad es 1, eliminar el item
        cartSlice.caseReducers.removeCartItem(state, action);
      }
    },
  },
});

export const {
  addToCart,
  updateCartItem,
  removeCartItem,
  removeManufacturer,
  removeProduct,
  clearCart,
  incrementItem,
  decrementItem,
} = cartSlice.actions;

export default cartSlice.reducer;