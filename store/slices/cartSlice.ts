import { createSlice } from '@reduxjs/toolkit';
import { CartState } from '@/types/cart';

const initialState: CartState = {
  users: {},
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
      state.users = {};
      state.lastUpdated = new Date().toISOString();
    },
  },
});

export const {
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;