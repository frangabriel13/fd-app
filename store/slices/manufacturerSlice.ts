import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { refreshTokenService } from '../../services/authService';
import { manufacturerInstance } from '../../services/axiosConfig';

// Tipos
interface Manufacturer {
  id: number;
  name: string;
  pointOfSale: boolean;
  street: string | null;
  owner: string;
  galleryName?: string | null;
  storeNumber?: string | null;
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
    pointOfSale: boolean;
    street: string | null;
    owner: string;
    phone: string;
    minPurchase: number;
    userId: number;
    galleryName?: string | null;
    storeNumber?: string | null;
  }, { rejectWithValue }) => {
    try {
      const response = await manufacturerInstance.post('/', manufacturerData);
      return response.data;
    } catch(error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear fabricante');
    }
  }
);

export const uploadDocuments = createAsyncThunk(
  'manufacturer/uploadDocuments',
  async (
    { id, images }: { id: number; images: { [key: string]: File } },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      for(const [key, file] of Object.entries(images)) {
        formData.append(key, file);
      }

      const response = await manufacturerInstance.post(`/${id}/images`, formData);

      return response.data;
    } catch(error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al subir documentos');
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
    resetManufacturerState: (state) => {
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
      })
      // Upload Documents
      .addCase(uploadDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(uploadDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(uploadDocuments.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string || 'Error al subir documentos';
      });
  },
});

export const { clearError, logout, setToken, resetManufacturerState } = manufacturerSlice.actions;
export default manufacturerSlice.reducer;