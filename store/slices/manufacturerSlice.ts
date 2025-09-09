import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { refreshTokenService } from '../../services/authService';
import { authInstance, manufacturerInstance } from '../../services/axiosConfig';
import { resetState } from './wholesalerSlice';

// Tipos
interface Manufacturer {
  id: number;
  name: string;
  pointOfSale: string;
  street: string;
  owner: string;
  phone: string;
  minPurchase: number;
  userId: number;
}

interface ManufacturerState {
  loading: boolean;
  success: boolean;
  error: string | null;
  token: string | null;
}

// Estado inicial
const initialState: ManufacturerState = {
  loading: false,
  success: false,
  error: null,
  token: null,
};

// Thunk para refresh token
export const refreshToken = createAsyncThunk(
  'manufacturer/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      return await refreshTokenService();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error refreshing token');
    }
  }
);

export const createManufacturer = createAsyncThunk(
  'manufacturer/createManufacturer',
  async (manufacturerData:{
    name: string;
    pointOfSale: string;
    street: string;
    owner: string;
    phone: string;
    minPurchase: number;
    userId: number;
  }, { rejectWithValue }) => {
    try {
      const response = await manufacturerInstance.post('/', manufacturerData);
      return response.data;
    } catch(error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear fabricante');
    }
  }
);

// Slice
const manufacturerSlice = createSlice({
  name: 'manufacturer',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.token = null;
      AsyncStorage.removeItem('token');
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Manufacturer
      .addCase(createManufacturer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createManufacturer.fulfilled, (state, action: PayloadAction<Manufacturer>) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(createManufacturer.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string || 'Error al crear fabricante';
      });
  },
});

export const { clearError, logout, setToken } = manufacturerSlice.actions;
export default manufacturerSlice.reducer;