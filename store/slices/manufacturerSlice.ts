import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { refreshTokenService } from '../../services/authService';
import { manufacturerInstance } from '../../services/axiosConfig';

// Tipos
interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    wholesaler: {
      id: number;
      name: string;
    };
  };
}

interface ManufacturerDetail extends Manufacturer {
  averageRating: number | null;
  followersCount: number;
  isFollowed: boolean;
  reviews: Review[];
  user: {
    id: number;
    email: string;
  };
}

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
  // Propiedades adicionales del fabricante
  address?: string | null;
  country?: string;
  description?: string | null;
  discount?: number;
  dniBack?: string | null;
  dniFront?: string | null;
  image?: string | null;
  instagramNick?: string | null;
  live?: boolean;
  number?: string | null;
  postalCode?: number | null;
  province?: string | null;
  selfie?: string | null;
  tiktokUrl?: string | null;
  verificationStatus?: string;
  createdAt?: string;
  updatedAt?: string;
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
  selectedManufacturer: ManufacturerDetail | null;
  liveManufacturers: LiveManufacturer[];
  // Nuevos campos para paginación
  currentPage: number;
  hasMoreData: boolean;
  isLoadingMore: boolean;
  // Para el detalle del fabricante
  loadingDetail: boolean;
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
  selectedManufacturer: null,
  liveManufacturers: [],
  currentPage: 1,
  hasMoreData: true,
  isLoadingMore: false,
  loadingDetail: false,
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

// Traer fabricantes en vivo con paginación mejorada
export const fetchAllLiveManufacturers = createAsyncThunk(
  'manufacturer/fetchAllLiveManufacturers',
  async ({ 
    page = 1, 
    limit, 
    isFirstLoad = false 
  }: { 
    page?: number; 
    limit?: number; 
    isFirstLoad?: boolean; 
  }, { rejectWithValue }) => {
    try {
      const response = await manufacturerInstance.get('/all-live', {
        params: { 
          page, 
          limit,
          isFirstLoad: isFirstLoad.toString()
        },
      });
      return {
        data: response.data,
        page,
        isFirstLoad
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener fabricantes en vivo');
    }
  }
);

// Traer fabricantes en vivo (mantener compatibilidad)
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

// Obtener fabricante por ID
export const getManufacturerById = createAsyncThunk(
  'manufacturer/getManufacturerById',
  async (manufacturerId: number, { rejectWithValue }) => {
    try {
      const response = await manufacturerInstance.get(`/by-id/${manufacturerId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener fabricante');
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
      state.currentPage = 1;
      state.hasMoreData = true;
      state.isLoadingMore = false;
    },
    resetPagination: (state) => {
      state.currentPage = 1;
      state.hasMoreData = true;
      state.isLoadingMore = false;
    },
    clearSelectedManufacturer: (state) => {
      state.selectedManufacturer = null;
      state.loadingDetail = false;
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
      // Fetch All Live Manufacturers (con paginación mejorada)
      .addCase(fetchAllLiveManufacturers.pending, (state, action) => {
        const { isFirstLoad } = action.meta.arg;
        if (isFirstLoad) {
          state.loading = true;
        } else {
          state.isLoadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchAllLiveManufacturers.fulfilled, (state, action) => {
        const { data, page, isFirstLoad } = action.payload;
        state.loading = false;
        state.isLoadingMore = false;
        state.error = null;
        
        if (isFirstLoad || page === 1) {
          // Primera carga o reset: reemplazar datos
          state.liveManufacturers = data;
        } else {
          // Carga adicional: concatenar datos
          state.liveManufacturers = [...state.liveManufacturers, ...data];
        }
        
        state.currentPage = page;
        // Si recibimos menos datos de lo esperado, no hay más datos
        const expectedSize = isFirstLoad ? 40 : 20;
        state.hasMoreData = data.length === expectedSize;
      })
      .addCase(fetchAllLiveManufacturers.rejected, (state, action) => {
        state.loading = false;
        state.isLoadingMore = false;
        state.error = action.payload as string || 'Error al obtener fabricantes en vivo';
        state.hasMoreData = false;
      })
      // Fetch Live Manufacturers (mantener compatibilidad)
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
      })
      // Get Manufacturer By ID
      .addCase(getManufacturerById.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(getManufacturerById.fulfilled, (state, action: PayloadAction<ManufacturerDetail>) => {
        state.loadingDetail = false;
        state.error = null;
        state.selectedManufacturer = action.payload;
      })
      .addCase(getManufacturerById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload as string || 'Error al obtener fabricante';
        state.selectedManufacturer = null;
      });

  },
});


export const { clearError, logout, setToken, resetManufacturerState, clearLiveManufacturers, resetPagination, clearSelectedManufacturer } = manufacturerSlice.actions;
export default manufacturerSlice.reducer;