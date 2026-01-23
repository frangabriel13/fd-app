import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

// Import your slices here
import userSlice from './slices/userSlice';
import manufacturerSlice from './slices/manufacturerSlice';
import authSlice from './slices/authSlice';
import wholesalerSlice from './slices/wholesalerSlice';
import ProductSlice from './slices/productSlice';
import cartSlice from './slices/cartSlice';
import orderSlice from './slices/orderSlice';
import colorSlice from './slices/colorSlice';
import sizeSlice from './slices/sizeSlice';
 import imageSlice from './slices/imageSlice';

// Combine all reducers
const rootReducer = combineReducers({
  user: userSlice,
  manufacturer: manufacturerSlice,
  auth: authSlice,
  wholesaler: wholesalerSlice,
  product: ProductSlice,
  cart: cartSlice,
  order: orderSlice,
  colors: colorSlice,
  sizes: sizeSlice,
  image: imageSlice,
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'manufacturer', 'auth', 'wholesaler', 'product', 'cart', 'order', 'colors', 'sizes', 'image'], // Only persist these reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
