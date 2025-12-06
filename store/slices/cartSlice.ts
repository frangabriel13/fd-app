import { createSlice } from '@reduxjs/toolkit';
import { CartState } from '@/types/cart';

const initialState: CartState = {
  manufacturers: {},
  lastUpdated: new Date().toISOString(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
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
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;