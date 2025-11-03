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

interface LiveManufacturer {
  id: number;
  name: string;
  image: string | null;
  live: boolean;
  tiktokUrl: string | null;
  user: {
    id: number;
    email: string;
  };
}

interface ManufacturerState {
  loading: boolean;
  success: boolean;
  error: string | null;
  token: string | null;
  manufacturer: Manufacturer | null;
  liveManufacturers: LiveManufacturer[];
}

interface ImageUpload {
  uri: string;
  type: string;
  name: string;
}

// Estado inicial
const initialState: ManufacturerState = {
  loading: false,
  success: false,
  error: null,
  token: null,
  manufacturer: null,
  liveManufacturers: [],
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
    { id, images }: { id: number; images: { [key: string]: ImageUpload } },
    { rejectWithValue }
  ) => {
    try {
      // console.log('Subiendo imágenes para fabricante ID:', id, images);
      const formData = new FormData();
      for(const [key, image] of Object.entries(images)) {
        formData.append(key, {
          uri: image.uri,
          type: image.type,
          name: image.name,
        } as any);
      }

      console.log('🌐 FormData preparado para la subida:', formData);

      const response = await manufacturerInstance.post(`/${id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response.data;
    } catch(error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al subir documentos');
    }
  }
);

// Traer fabricantes en vivo
export const fetchLiveManufacturers = createAsyncThunk(
  'manufacturer/fetchLiveManufacturers',
  async ({ page, pageSize }: { page: number; pageSize: number }, { rejectWithValue }) => {
    try {
      const response = await manufacturerInstance.get('/live', {
        params: { page, pageSize },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener fabricantes en vivo');
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
    clearLiveManufacturers: (state) => {
      state.liveManufacturers = [];
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
        state.manufacturer = action.payload;
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
      })
      // Fetch Live Manufacturers
      .addCase(fetchLiveManufacturers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLiveManufacturers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // El backend devuelve directamente un array de fabricantes en vivo
        state.liveManufacturers = action.payload;
      })
      .addCase(fetchLiveManufacturers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al obtener fabricantes en vivo';
        state.liveManufacturers = [];
      });

  },
});


export const { clearError, logout, setToken, resetManufacturerState, clearLiveManufacturers } = manufacturerSlice.actions;
export default manufacturerSlice.reducer;