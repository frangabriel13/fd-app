import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { sizeInstance } from '@/services/axiosConfig';

// Tipo para el Size basado en tu modelo
export interface Size {
  id: number;
  name: string;
  type: 'Alfanuméricos' | 'Numéricos' | 'Calzado' | 'Único';
  createdAt?: string;
  updatedAt?: string;
}

// Estado inicial del slice
interface SizeState {
  sizes: Record<string, Size[]>; // Agrupados por tipo
  loading: boolean;
  error: string | null;
}

const initialState: SizeState = {
  sizes: {},
  loading: false,
  error: null,
};

// Thunk asíncrono para obtener todos los tamaños
export const getSizes = createAsyncThunk(
  'sizes/getSizes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sizeInstance.get('/sizes');
      return response.data as Record<string, Size[]>;
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      if (error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error desconocido al obtener los tamaños');
    }
  }
);

// Slice de tamaños
const sizeSlice = createSlice({
  name: 'sizes',
  initialState,
  reducers: {
    // Reducer para limpiar errores
    clearError: (state) => {
      state.error = null;
    },
    // Reducer para resetear el estado
    resetSizes: (state) => {
      state.sizes = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Casos para getSizes
      .addCase(getSizes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSizes.fulfilled, (state, action: PayloadAction<Record<string, Size[]>>) => {
        state.loading = false;
        state.sizes = action.payload;
        state.error = null;
      })
      .addCase(getSizes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Exportar acciones
export const { clearError, resetSizes } = sizeSlice.actions;

// Exportar selectores
export const selectSizes = (state: { sizes: SizeState }) => state.sizes.sizes;
export const selectSizesLoading = (state: { sizes: SizeState }) => state.sizes.loading;
export const selectSizesError = (state: { sizes: SizeState }) => state.sizes.error;

// Exportar el reducer
export default sizeSlice.reducer;