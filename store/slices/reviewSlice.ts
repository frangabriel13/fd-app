import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reviewInstance } from '@/services/axiosConfig';

// Tipo para Review
export interface Review {
  id: number;
  userId: number;
  manufacturerId: number;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}

// Tipo para crear una review
export interface CreateReviewDto {
  manufacturerId: number;
  rating: number;
  comment: string;
}

// Tipo para actualizar una review
export interface UpdateReviewDto {
  id: number;
  rating: number;
  comment: string;
}

// Estado inicial del slice
interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

// Thunk asíncrono para crear una review
export const createReview = createAsyncThunk(
  'reviews/createReview',
  async ({ manufacturerId, rating, comment }: CreateReviewDto, { rejectWithValue }) => {
    try {
      console.log('⭐ Creating review for manufacturer:', manufacturerId);
      const response = await reviewInstance.post(`/${manufacturerId}`, { rating, comment });
      console.log('⭐ Review created:', response.data);
      return response.data as Review;
    } catch (error: any) {
      console.error('❌ Error creating review:', error);
      if (error.response?.status === 400) {
        return rejectWithValue('Ya has dejado una review para este manufacturer');
      }
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      if (error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error desconocido al crear la review');
    }
  }
);

// Thunk asíncrono para actualizar una review
export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ id, rating, comment }: UpdateReviewDto, { rejectWithValue }) => {
    try {
      console.log('✏️ Updating review:', id);
      const response = await reviewInstance.put(`/${id}`, { rating, comment });
      console.log('✏️ Review updated:', response.data);
      return response.data as Review;
    } catch (error: any) {
      console.error('❌ Error updating review:', error);
      if (error.response?.status === 404) {
        return rejectWithValue('Review no encontrada');
      }
      if (error.response?.status === 403) {
        return rejectWithValue('No tienes permiso para editar esta review');
      }
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      if (error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error desconocido al actualizar la review');
    }
  }
);

// Thunk asíncrono para eliminar una review
export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (id: number, { rejectWithValue }) => {
    try {
      console.log('🗑️ Deleting review:', id);
      await reviewInstance.delete(`/${id}`);
      console.log('🗑️ Review deleted');
      return id;
    } catch (error: any) {
      console.error('❌ Error deleting review:', error);
      if (error.response?.status === 404) {
        return rejectWithValue('Review no encontrada');
      }
      if (error.response?.status === 403) {
        return rejectWithValue('No tienes permiso para eliminar esta review');
      }
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      if (error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error desconocido al eliminar la review');
    }
  }
);

// Slice de reviews
const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    // Reducer para limpiar errores
    clearError: (state) => {
      state.error = null;
    },
    // Reducer para resetear el estado
    resetReviews: (state) => {
      state.reviews = [];
      state.loading = false;
      state.error = null;
    },
    // Reducer para establecer reviews (útil si las obtienes desde otro endpoint)
    setReviews: (state, action: PayloadAction<Review[]>) => {
      state.reviews = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Casos para createReview
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.loading = false;
        state.reviews.push(action.payload);
        state.error = null;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Casos para updateReview
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.loading = false;
        const index = state.reviews.findIndex(review => review.id === action.payload.id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Casos para deleteReview
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.reviews = state.reviews.filter(review => review.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Exportar acciones
export const { clearError, resetReviews, setReviews } = reviewSlice.actions;

// Exportar selectores
export const selectReviews = (state: { reviews: ReviewState }) => state.reviews.reviews;
export const selectReviewsLoading = (state: { reviews: ReviewState }) => state.reviews.loading;
export const selectReviewsError = (state: { reviews: ReviewState }) => state.reviews.error;

// Helper selector para obtener review de un manufacturer específico
export const selectReviewByManufacturer = (manufacturerId: number) => (state: { reviews: ReviewState }) => {
  return state.reviews.reviews.find(review => review.manufacturerId === manufacturerId);
};

// Exportar el reducer
export default reviewSlice.reducer;
