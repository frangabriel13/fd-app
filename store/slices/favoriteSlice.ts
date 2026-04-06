import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { favoriteInstance } from '@/services/axiosConfig';

export interface FavoriteProduct {
  productId: number;
  userId: number;
  name: string;
  mainImage: string;
  price: string;
  logo: string | null;
}

interface FavoriteState {
  favoriteProducts: FavoriteProduct[];
  loading: boolean;
  removingProductId: number | null;
  error: string | null;
}

const initialState: FavoriteState = {
  favoriteProducts: [],
  loading: false,
  removingProductId: null,
  error: null,
};

export const addFavorite = createAsyncThunk(
  'favorites/addFavorite',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await favoriteInstance.post('/', { productId });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        return rejectWithValue('Ya has agregado este producto a favoritos');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Error desconocido al agregar favorito');
    }
  }
);

export const getFavorites = createAsyncThunk(
  'favorites/getFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await favoriteInstance.get('/');
      return response.data as FavoriteProduct[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Error desconocido al obtener los favoritos');
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async (productId: number, { rejectWithValue }) => {
    try {
      await favoriteInstance.delete(`/${productId}`);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Error desconocido al eliminar favorito');
    }
  }
);

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetFavorites: (state) => {
      state.favoriteProducts = [];
      state.loading = false;
      state.removingProductId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // addFavorite
      .addCase(addFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // getFavorites
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
      // removeFavorite
      .addCase(removeFavorite.pending, (state, action) => {
        state.removingProductId = action.meta.arg;
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, action: PayloadAction<number>) => {
        state.removingProductId = null;
        state.favoriteProducts = state.favoriteProducts.filter(
          product => product.productId !== action.payload
        );
        state.error = null;
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.removingProductId = null;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetFavorites } = favoriteSlice.actions;

export const selectFavoriteProducts = (state: { favorites: FavoriteState }) => state.favorites.favoriteProducts;
export const selectFavoritesLoading = (state: { favorites: FavoriteState }) => state.favorites.loading;
export const selectFavoritesError = (state: { favorites: FavoriteState }) => state.favorites.error;
export const selectRemovingProductId = (state: { favorites: FavoriteState }) => state.favorites.removingProductId;

export const selectIsProductFavorite = (productId: number) => (state: { favorites: FavoriteState }) =>
  state.favorites.favoriteProducts.some(product => product.productId === productId);

export default favoriteSlice.reducer;
