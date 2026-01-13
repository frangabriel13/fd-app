import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderInstance } from '@/services/axiosConfig';

// Tipos
interface User {
  id: number;
  email: string;
  wholesaler?: {
    id: number;
    name: string;
    phone: string;
  };
  manufacturer?: {
    id: number;
    name: string;
    phone: string;
  };
}

interface SubOrder {
  id: number;
  subtotal: number;
  status: string;
  products: any[];
  packs: any[];
  user: User;
}

interface UnifiedOrder {
  id: number;
  unifique: boolean;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  subOrders: SubOrder[];
}

interface UnifiedOrdersResponse {
  unifiedOrders: UnifiedOrder[];
  total: number;
  totalPages: number;
  page: number;
}

interface OrderState {
  // Estados para pedidos unificados
  unifiedOrders: UnifiedOrder[];
  unifiedOrdersTotal: number;
  unifiedOrdersTotalPages: number;
  unifiedOrdersCurrentPage: number;
  loadingUnifiedOrders: boolean;
  errorUnifiedOrders: string | null;
  
  // Estados generales
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Estado inicial
const initialState: OrderState = {
  // Estados para pedidos unificados
  unifiedOrders: [],
  unifiedOrdersTotal: 0,
  unifiedOrdersTotalPages: 0,
  unifiedOrdersCurrentPage: 1,
  loadingUnifiedOrders: false,
  errorUnifiedOrders: null,
  
  // Estados generales
  loading: false,
  error: null,
  success: false,
};

// Thunk para obtener pedidos unificados
export const fetchUnifiedOrders = createAsyncThunk(
  'order/fetchUnifiedOrders',
  async ({ 
    page = 1, 
    limit = 15 
  }: { 
    page?: number; 
    limit?: number; 
  }, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching unified orders - Page:', page, 'Limit:', limit);
      
      const response = await orderInstance.get('/unified', {
        params: { 
          page, 
          limit 
        },
      });

      console.log('✅ Unified orders fetched successfully:', {
        total: response.data.total,
        totalPages: response.data.totalPages,
        currentPage: response.data.page,
        ordersCount: response.data.unifiedOrders.length
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching unified orders:', error);
      return rejectWithValue(error.response?.data?.message || 'Error al obtener pedidos unificados');
    }
  }
);

// Slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.errorUnifiedOrders = null;
    },
    clearUnifiedOrders: (state) => {
      state.unifiedOrders = [];
      state.unifiedOrdersTotal = 0;
      state.unifiedOrdersTotalPages = 0;
      state.unifiedOrdersCurrentPage = 1;
      state.errorUnifiedOrders = null;
    },
    setUnifiedOrdersPage: (state, action: PayloadAction<number>) => {
      state.unifiedOrdersCurrentPage = action.payload;
    },
    resetOrderState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Unified Orders
      .addCase(fetchUnifiedOrders.pending, (state) => {
        state.loadingUnifiedOrders = true;
        state.errorUnifiedOrders = null;
      })
      .addCase(fetchUnifiedOrders.fulfilled, (state, action: PayloadAction<UnifiedOrdersResponse>) => {
        state.loadingUnifiedOrders = false;
        state.unifiedOrders = action.payload.unifiedOrders;
        state.unifiedOrdersTotal = action.payload.total;
        state.unifiedOrdersTotalPages = action.payload.totalPages;
        state.unifiedOrdersCurrentPage = action.payload.page;
        state.errorUnifiedOrders = null;
        state.success = true;
      })
      .addCase(fetchUnifiedOrders.rejected, (state, action) => {
        state.loadingUnifiedOrders = false;
        state.errorUnifiedOrders = action.payload as string;
        state.success = false;
      });
  },
});

export const { 
  clearError, 
  clearUnifiedOrders, 
  setUnifiedOrdersPage, 
  resetOrderState 
} = orderSlice.actions;

export default orderSlice.reducer;
