import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { favoriteInstance } from '@/services/axiosConfig';

// Tipo para el Favorite basado en tu modelo
export interface Favorite {
  id: number;
  userId: number;
  productId: number;
  createdAt?: string;
  updatedAt?: string;
}

// Tipo para el producto favorito (lo que devuelve GET /favorites)
export interface FavoriteProduct {
  productId: number;
  name: string;
  mainImage: string;
  price: number;
}

// Estado inicial del slice
interface FavoriteState {
  favorites: Favorite[];
  favoriteProducts: FavoriteProduct[]; // Productos completos desde GET
  loading: boolean;
  error: string | null;
}

const initialState: FavoriteState = {
  favorites: [],
  favoriteProducts: [],
  loading: false,
  error: null,
};

// Thunk asíncrono para agregar un favorito
export const addFavorite = createAsyncThunk(
  'favorites/addFavorite',
  async (productId: number, { rejectWithValue }) => {
    try {
      console.log('❤️ Adding favorite for product:', productId);
      const response = await favoriteInstance.post('/', { productId });
      console.log('❤️ Favorite added:', response.data);
      return response.data as Favorite;
    } catch (error: any) {
      console.error('❌ Error adding favorite:', error);
      if (error.response?.status === 400) {
        return rejectWithValue('Ya has agregado este producto a favoritos');
      }
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      if (error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error desconocido al agregar favorito');
    }
  }
);

// Thunk asíncrono para obtener todos los favoritos del usuario
export const getFavorites = createAsyncThunk(
  'favorites/getFavorites',
  async (_, { rejectWithValue }) => {
    try {
      console.log('❤️ Fetching favorites from API...');
      const response = await favoriteInstance.get('/');
      console.log('❤️ Favorites response:', response.data);
      return response.data as FavoriteProduct[]; // Devuelve productos completos
    } catch (error: any) {
      console.error('❌ Error fetching favorites:', error);
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      if (error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error desconocido al obtener los favoritos');
    }
  }
);

// Thunk asíncrono para eliminar un favorito
export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async (productId: number, { rejectWithValue }) => {
    try {
      console.log('💔 Removing favorite for product:', productId);
      await favoriteInstance.delete(`/${productId}`);
      console.log('💔 Favorite removed');
      return productId;
    } catch (error: any) {
      console.error('❌ Error removing favorite:', error);
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      if (error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error desconocido al eliminar favorito');
    }
  }
);

// Slice de favoritos
const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Reducer para limpiar errores
    clearError: (state) => {
      state.error = null;
    },
    // Reducer para resetear el estado
    resetFavorites: (state) => {
      state.favorites = [];
      state.favoriteProducts = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Casos para addFavorite
      .addCase(addFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state, action: PayloadAction<Favorite>) => {
        state.loading = false;
        state.favorites.push(action.payload);
        state.error = null;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Casos para getFavorites
      .addCase(getFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFavorites.fulfilled, (state, action: PayloadAction<FavoriteProduct[]>) => {
        state.loading = false;
        state.favoriteProducts = action.payload;
        state.error = null;
      })
      .addCase(getFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Casos para removeFavorite
      .addCase(removeFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        // Remover de favorites si existe
        state.favorites = state.favorites.filter(
          fav => fav.productId !== action.payload
        );
        // Remover de favoriteProducts también
        state.favoriteProducts = state.favoriteProducts.filter(
          product => product.productId !== action.payload
        );
        state.error = null;
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Exportar acciones
export const { clearError, resetFavorites } = favoriteSlice.actions;

// Exportar selectores
export const selectFavorites = (state: { favorites: FavoriteState }) => state.favorites.favorites;
export const selectFavoriteProducts = (state: { favorites: FavoriteState }) => state.favorites.favoriteProducts;
export const selectFavoritesLoading = (state: { favorites: FavoriteState }) => state.favorites.loading;
export const selectFavoritesError = (state: { favorites: FavoriteState }) => state.favorites.error;

// Helper selector para verificar si un producto está en favoritos
export const selectIsProductFavorite = (productId: number) => (state: { favorites: FavoriteState }) =>
  state.favorites.favoriteProducts.some(product => product.productId === productId);

// Exportar el reducer
export default favoriteSlice.reducer;
