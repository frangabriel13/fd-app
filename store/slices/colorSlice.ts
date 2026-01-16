import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { colorInstance } from '@/services/axiosConfig';

// Tipo para el Color basado en tu modelo
export interface Color {
  id: number;
  name: string;
  code: string;
  createdAt?: string;
  updatedAt?: string;
}

// Estado inicial del slice
interface ColorState {
  colors: Color[];
  loading: boolean;
  error: string | null;
}

const initialState: ColorState = {
  colors: [],
  loading: false,
  error: null,
};

// Thunk asíncrono para obtener todos los colores
export const getColors = createAsyncThunk(
  'colors/getColors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await colorInstance.get('/colors');
      return response.data as Color[];
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      if (error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error desconocido al obtener los colores');
    }
  }
);

// Slice de colores
const colorSlice = createSlice({
  name: 'colors',
  initialState,
  reducers: {
    // Reducer para limpiar errores
    clearError: (state) => {
      state.error = null;
    },
    // Reducer para resetear el estado
    resetColors: (state) => {
      state.colors = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Casos para getColors
      .addCase(getColors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getColors.fulfilled, (state, action: PayloadAction<Color[]>) => {
        state.loading = false;
        state.colors = action.payload;
        state.error = null;
      })
      .addCase(getColors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Exportar acciones
export const { clearError, resetColors } = colorSlice.actions;

// Exportar selectores
export const selectColors = (state: { colors: ColorState }) => state.colors.colors;
export const selectColorsLoading = (state: { colors: ColorState }) => state.colors.loading;
export const selectColorsError = (state: { colors: ColorState }) => state.colors.error;

// Exportar el reducer
export default colorSlice.reducer;
