import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { refreshTokenService } from '../../services/authService';
import { authInstance, manufacturerInstance } from '../../services/axiosConfig';

// Tipos
interface Manufacturer {
  id: string;
  name: string;
  email: string;
  // Agrega más propiedades según tu modelo
}

interface ManufacturerState {
  currentManufacturer: Manufacturer | null;
  manufacturers: Manufacturer[];
  loading: boolean;
  error: string | null;
  token: string | null;
}

// Estado inicial
const initialState: ManufacturerState = {
  currentManufacturer: null,
  manufacturers: [],
  loading: false,
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

// Thunk para login
export const loginManufacturer = createAsyncThunk(
  'manufacturer/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authInstance.post('/login', credentials);
      const { token, manufacturer } = response.data;
      await AsyncStorage.setItem('token', token);
      return { token, manufacturer };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error logging in');
    }
  }
);

// Thunk para obtener perfil del manufacturer
export const getManufacturerProfile = createAsyncThunk(
  'manufacturer/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await manufacturerInstance.get('/profile');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error getting profile');
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
      state.currentManufacturer = null;
      state.token = null;
      AsyncStorage.removeItem('token');
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
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
      // Login
      .addCase(loginManufacturer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginManufacturer.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.currentManufacturer = action.payload.manufacturer;
      })
      .addCase(loginManufacturer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Profile
      .addCase(getManufacturerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getManufacturerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentManufacturer = action.payload;
      })
      .addCase(getManufacturerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, logout, setToken } = manufacturerSlice.actions;
export default manufacturerSlice.reducer;