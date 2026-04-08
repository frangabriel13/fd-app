import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createTransform, persistReducer, persistStore } from 'redux-persist';

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
import favoriteSlice from './slices/favoriteSlice';
import reviewSlice from './slices/reviewSlice';
import notificationReducer from './slices/notificationSlice';

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
  favorites: favoriteSlice,
  reviews: reviewSlice,
  notifications: notificationReducer,
});

// Excluye el estado de búsqueda del producto de la persistencia — si la app
// se cierra con searchLoading: true, al volver quedaría en un estado de carga infinita.
const productTransform = createTransform(
  (inboundState: any) => {
    const { searchResults, searchLoading, ...rest } = inboundState;
    return rest;
  },
  (outboundState) => outboundState,
  { whitelist: ['product'] }
);

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'manufacturer', 'auth', 'wholesaler', 'product', 'cart', 'order', 'colors', 'sizes', 'image', 'favorites', 'reviews'],
  transforms: [productTransform],
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
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
