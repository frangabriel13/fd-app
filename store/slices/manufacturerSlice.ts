import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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

// Instancia de axios para manufacturers (sin interceptores aquí para evitar dependencias circulares)
const manufacturerAxios = axios.create({
  baseURL: 'http://localhost:3001/api/manufacturers',
});

// Thunk para refresh token
export const refreshToken = createAsyncThunk(
  'manufacturer/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Refreshing token...');
      const response = await manufacturerAxios.post('/refresh-token');
      const newToken = response.data.token;
      await AsyncStorage.setItem('token', newToken);
      return newToken;
    } catch (error: any) {
      console.error('Error refreshing token:', error);
      return rejectWithValue(error.response?.data?.message || 'Error refreshing token');
    }
  }
);

// Thunk para login
export const loginManufacturer = createAsyncThunk(
  'manufacturer/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', credentials);
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
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }
      
      const response = await manufacturerAxios.get('/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
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