import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { refreshTokenService } from '../../services/authService';
import { manufacturerInstance, adminInstance } from '../../services/axiosConfig';

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

interface ApprovedManufacturer {
  id: number;
  name: string;
  createdAt: string;
  live: boolean;
  userId: number;
  street: string | null;
}

interface PendingManufacturer {
  id: number;
  name: string;
  createdAt: string;
  userId: number;
  verificationStatus: string;
}

interface ManufacturersResponse<T> {
  totalManufacturers: number;
  currentPage: number;
  pageSize: number;
  manufacturers: T[];
  sortBy?: string;
  sortOrder?: string;
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
  // Estados para fabricantes aprobados
  approvedManufacturers: ApprovedManufacturer[];
  approvedManufacturersTotal: number;
  approvedCurrentPage: number;
  approvedPageSize: number;
  approvedSortBy: string;
  approvedSortOrder: string;
  loadingApproved: boolean;
  // Estados para fabricantes pendientes
  pendingManufacturers: PendingManufacturer[];
  pendingManufacturersTotal: number;
  pendingCurrentPage: number;
  pendingPageSize: number;
  pendingSortBy: string;
  pendingSortOrder: string;
  loadingPending: boolean;
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
  // Estados para fabricantes aprobados
  approvedManufacturers: [],
  approvedManufacturersTotal: 0,
  approvedCurrentPage: 1,
  approvedPageSize: 10,
  approvedSortBy: 'createdAt',
  approvedSortOrder: 'desc',
  loadingApproved: false,
  // Estados para fabricantes pendientes
  pendingManufacturers: [],
  pendingManufacturersTotal: 0,
  pendingCurrentPage: 1,
  pendingPageSize: 10,
  pendingSortBy: 'createdAt',
  pendingSortOrder: 'desc',
  loadingPending: false,
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

// Obtener fabricantes aprobados
export const fetchApprovedManufacturers = createAsyncThunk(
  'manufacturer/fetchApprovedManufacturers',
  async ({ 
    page = 1, 
    pageSize = 10, 
    sortBy = 'createdAt', 
    sortOrder = 'desc' 
  }: { 
    page?: number; 
    pageSize?: number; 
    sortBy?: string; 
    sortOrder?: string; 
  }, { rejectWithValue }) => {
    try {
      const response = await manufacturerInstance.get('/approved', {
        params: { page, pageSize, sortBy, sortOrder },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener fabricantes aprobados');
    }
  }
);

// Obtener fabricantes pendientes
export const fetchPendingManufacturers = createAsyncThunk(
  'manufacturer/fetchPendingManufacturers',
  async ({ 
    page = 1, 
    pageSize = 10, 
    sortBy = 'createdAt', 
    sortOrder = 'desc' 
  }: { 
    page?: number; 
    pageSize?: number; 
    sortBy?: string; 
    sortOrder?: string; 
  }, { rejectWithValue }) => {
    try {
      const response = await manufacturerInstance.get('/pending', {
        params: { page, pageSize, sortBy, sortOrder },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener fabricantes pendientes');
    }
  }
);

// Toggle Live Status
export const toggleLiveManufacturer = createAsyncThunk(
  'manufacturer/toggleLiveManufacturer',
  async (manufacturerId: number, { rejectWithValue }) => {
    try {
      const response = await adminInstance.put(`/toggle-live/${manufacturerId}`);
      return {
        manufacturerId,
        manufacturer: response.data.manufacturer
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cambiar estado live');
    }
  }
);

// Update Manufacturer Logo
export const updateManufacturerLogo = createAsyncThunk(
  'manufacturer/updateManufacturerLogo',
  async (
    { id, logo }: { id: number; logo: ImageUpload },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append('logo', {
        uri: logo.uri,
        type: logo.type,
        name: logo.name,
      } as any);

      const response = await manufacturerInstance.put(`/logo/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return {
        id,
        image: response.data.image
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar logo');
    }
  }
);

// Update Manufacturer Data
export const updateManufacturer = createAsyncThunk(
  'manufacturer/updateManufacturer',
  async (
    { 
      id, 
      data 
    }: { 
      id: number; 
      data: {
        name?: string;
        owner?: string;
        phone?: string;
        pointOfSale?: boolean;
        street?: string | null;
        minPurchase?: number;
        tiktokUrl?: string | null;
        instagramNick?: string | null;
        description?: string | null;
      }
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await manufacturerInstance.put(`/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar fabricante');
    }
  }
);

// Activate/Deactivate Live Status (for authenticated manufacturer)
export const activateLiveManufacturer = createAsyncThunk(
  'manufacturer/activateLiveManufacturer',
  async (_, { rejectWithValue }) => {
    try {
      const response = await manufacturerInstance.put('/activate');
      return response.data.manufacturer;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cambiar estado live');
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
    clearApprovedManufacturers: (state) => {
      state.approvedManufacturers = [];
      state.approvedManufacturersTotal = 0;
      state.approvedCurrentPage = 1;
      state.approvedSortBy = 'createdAt';
      state.approvedSortOrder = 'desc';
      state.loadingApproved = false;
    },
    clearPendingManufacturers: (state) => {
      state.pendingManufacturers = [];
      state.pendingManufacturersTotal = 0;
      state.pendingCurrentPage = 1;
      state.pendingSortBy = 'createdAt';
      state.pendingSortOrder = 'desc';
      state.loadingPending = false;
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
      })
      // Fetch Approved Manufacturers
      .addCase(fetchApprovedManufacturers.pending, (state) => {
        state.loadingApproved = true;
        state.error = null;
      })
      .addCase(fetchApprovedManufacturers.fulfilled, (state, action: PayloadAction<ManufacturersResponse<ApprovedManufacturer>>) => {
        state.loadingApproved = false;
        state.error = null;
        state.approvedManufacturers = action.payload.manufacturers;
        state.approvedManufacturersTotal = action.payload.totalManufacturers;
        state.approvedCurrentPage = action.payload.currentPage;
        state.approvedPageSize = action.payload.pageSize;
        state.approvedSortBy = action.payload.sortBy || 'createdAt';
        state.approvedSortOrder = action.payload.sortOrder || 'desc';
      })
      .addCase(fetchApprovedManufacturers.rejected, (state, action) => {
        state.loadingApproved = false;
        state.error = action.payload as string || 'Error al obtener fabricantes aprobados';
      })
      // Fetch Pending Manufacturers
      .addCase(fetchPendingManufacturers.pending, (state) => {
        state.loadingPending = true;
        state.error = null;
      })
      .addCase(fetchPendingManufacturers.fulfilled, (state, action: PayloadAction<ManufacturersResponse<PendingManufacturer>>) => {
        state.loadingPending = false;
        state.error = null;
        state.pendingManufacturers = action.payload.manufacturers;
        state.pendingManufacturersTotal = action.payload.totalManufacturers;
        state.pendingCurrentPage = action.payload.currentPage;
        state.pendingPageSize = action.payload.pageSize;
        state.pendingSortBy = action.payload.sortBy || 'createdAt';
        state.pendingSortOrder = action.payload.sortOrder || 'desc';
      })
      .addCase(fetchPendingManufacturers.rejected, (state, action) => {
        state.loadingPending = false;
        state.error = action.payload as string || 'Error al obtener fabricantes pendientes';
      })
      // Toggle Live Status
      .addCase(toggleLiveManufacturer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleLiveManufacturer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Actualizar el manufacturer en la lista de aprobados
        const { manufacturerId, manufacturer } = action.payload;
        const index = state.approvedManufacturers.findIndex(m => m.id === manufacturerId);
        if (index !== -1) {
          state.approvedManufacturers[index] = {
            ...state.approvedManufacturers[index],
            live: manufacturer.live
          };
        }
      })
      .addCase(toggleLiveManufacturer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al cambiar estado live';
      })
      // Update Manufacturer Logo
      .addCase(updateManufacturerLogo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateManufacturerLogo.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        const { id, image } = action.payload;
        
        // Actualizar el logo en el manufacturer actual si coincide
        if (state.manufacturer && state.manufacturer.id === id) {
          state.manufacturer.image = image;
        }
        
        // Actualizar el logo en selectedManufacturer si coincide
        if (state.selectedManufacturer && state.selectedManufacturer.id === id) {
          state.selectedManufacturer.image = image;
        }
        
        // Actualizar en la lista de fabricantes en vivo
        const liveIndex = state.liveManufacturers.findIndex(m => m.id === id);
        if (liveIndex !== -1) {
          state.liveManufacturers[liveIndex] = {
            ...state.liveManufacturers[liveIndex],
            image
          };
        }
      })
      .addCase(updateManufacturerLogo.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string || 'Error al actualizar logo';
      })
      // Update Manufacturer Data
      .addCase(updateManufacturer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateManufacturer.fulfilled, (state, action: PayloadAction<Manufacturer>) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        const updatedManufacturer = action.payload;
        
        // Actualizar el manufacturer actual si coincide
        if (state.manufacturer && state.manufacturer.id === updatedManufacturer.id) {
          state.manufacturer = { ...state.manufacturer, ...updatedManufacturer };
        }
        
        // Actualizar selectedManufacturer si coincide
        if (state.selectedManufacturer && state.selectedManufacturer.id === updatedManufacturer.id) {
          state.selectedManufacturer = { ...state.selectedManufacturer, ...updatedManufacturer };
        }
        
        // Actualizar en la lista de fabricantes en vivo
        const liveIndex = state.liveManufacturers.findIndex(m => m.id === updatedManufacturer.id);
        if (liveIndex !== -1) {
          state.liveManufacturers[liveIndex] = {
            ...state.liveManufacturers[liveIndex],
            name: updatedManufacturer.name,
            tiktokUrl: updatedManufacturer.tiktokUrl
          };
        }
        
        // Actualizar en la lista de fabricantes aprobados
        const approvedIndex = state.approvedManufacturers.findIndex(m => m.id === updatedManufacturer.id);
        if (approvedIndex !== -1) {
          state.approvedManufacturers[approvedIndex] = {
            ...state.approvedManufacturers[approvedIndex],
            name: updatedManufacturer.name,
            street: updatedManufacturer.street
          };
        }
      })
      .addCase(updateManufacturer.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string || 'Error al actualizar fabricante';
      })
      // Activate/Deactivate Live Status
      .addCase(activateLiveManufacturer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateLiveManufacturer.fulfilled, (state, action: PayloadAction<Manufacturer>) => {
        state.loading = false;
        state.error = null;
        const updatedManufacturer = action.payload;
        
        // Actualizar el manufacturer actual
        if (state.manufacturer) {
          state.manufacturer.live = updatedManufacturer.live;
        }
        
        // Actualizar selectedManufacturer si coincide
        if (state.selectedManufacturer && state.selectedManufacturer.id === updatedManufacturer.id) {
          state.selectedManufacturer.live = updatedManufacturer.live;
        }
        
        // Actualizar en la lista de fabricantes en vivo
        const liveIndex = state.liveManufacturers.findIndex(m => m.id === updatedManufacturer.id);
        if (liveIndex !== -1) {
          state.liveManufacturers[liveIndex] = {
            ...state.liveManufacturers[liveIndex],
            live: updatedManufacturer.live
          };
        }
        
        // Actualizar en la lista de fabricantes aprobados
        const approvedIndex = state.approvedManufacturers.findIndex(m => m.id === updatedManufacturer.id);
        if (approvedIndex !== -1) {
          state.approvedManufacturers[approvedIndex] = {
            ...state.approvedManufacturers[approvedIndex],
            live: updatedManufacturer.live
          };
        }
      })
      .addCase(activateLiveManufacturer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al cambiar estado live';
      });

  },
});


export const { 
  clearError, 
  logout, 
  setToken, 
  resetManufacturerState, 
  clearLiveManufacturers, 
  resetPagination, 
  clearSelectedManufacturer,
  clearApprovedManufacturers,
  clearPendingManufacturers
} = manufacturerSlice.actions;
export default manufacturerSlice.reducer;