import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderInstance } from '@/services/axiosConfig';

// Tipos para crear órdenes
interface CreateOrderCart {
  manufacturer: {
    userId: number;
    id: number;
    name: string;
  };
  products: any[];
  packs: any[];
  totalCart: number;
}

interface CreateOrderPayload {
  carts: CreateOrderCart[];
}

interface CreateOrderResponse {
  id: number;
  userId: number;
  total: number;
  subOrders: number[];
  unifique: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

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

interface Order {
  id: number;
  unifique: boolean;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  subOrders: SubOrder[];
}

type MyOrdersResponse = Order[];

interface MySubOrdersResponse {
  subOrders: SubOrder[];
}

interface OrderState {
  // Estados para pedidos unificados
  unifiedOrders: UnifiedOrder[];
  unifiedOrdersTotal: number;
  unifiedOrdersTotalPages: number;
  unifiedOrdersCurrentPage: number;
  loadingUnifiedOrders: boolean;
  errorUnifiedOrders: string | null;
  
  // Estados para mis pedidos
  myOrders: Order[];
  loadingMyOrders: boolean;
  errorMyOrders: string | null;
  
  // Estados para mis sub-pedidos
  mySubOrders: SubOrder[];
  loadingMySubOrders: boolean;
  errorMySubOrders: string | null;
  
  // Estados para crear órdenes
  createdOrder: CreateOrderResponse | null;
  loadingCreateOrder: boolean;
  errorCreateOrder: string | null;
  
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
  
  // Estados para mis pedidos
  myOrders: [],
  loadingMyOrders: false,
  errorMyOrders: null,
  
  // Estados para mis sub-pedidos
  mySubOrders: [],
  loadingMySubOrders: false,
  errorMySubOrders: null,
  
  // Estados para crear órdenes
  createdOrder: null,
  loadingCreateOrder: false,
  errorCreateOrder: null,
  
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

// Thunk para obtener mis pedidos
export const fetchMyOrders = createAsyncThunk(
  'order/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderInstance.get('/my-orders');

      console.log('orders', response.data);
      console.log('✅ My orders fetched successfully:', {
        ordersCount: response.data?.length || 0
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching my orders:', error);
      return rejectWithValue(error.response?.data?.message || 'Error al obtener mis pedidos');
    }
  }
);

// Thunk para obtener mis sub-pedidos
export const fetchMySubOrders = createAsyncThunk(
  'order/fetchMySubOrders',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching my sub-orders');
      
      const response = await orderInstance.get('/my-suborders');

      console.log('✅ My sub-orders fetched successfully:', {
        subOrdersCount: response.data.subOrders?.length || 0
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching my sub-orders:', error);
      return rejectWithValue(error.response?.data?.message || 'Error al obtener mis sub-pedidos');
    }
  }
);

// Thunk para crear una nueva orden
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData: CreateOrderPayload, { rejectWithValue }) => {
    try {
      console.log('🔄 Creating order:', orderData);
      
      const response = await orderInstance.post('/', orderData);

      console.log('✅ Order created successfully:', {
        orderId: response.data.id,
        total: response.data.total,
        subOrders: response.data.subOrders
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ Error creating order:', error);
      return rejectWithValue(error.response?.data?.message || 'Error al crear la orden');
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
      state.errorMyOrders = null;
      state.errorMySubOrders = null;
      state.errorCreateOrder = null;
    },
    clearUnifiedOrders: (state) => {
      state.unifiedOrders = [];
      state.unifiedOrdersTotal = 0;
      state.unifiedOrdersTotalPages = 0;
      state.unifiedOrdersCurrentPage = 1;
      state.errorUnifiedOrders = null;
    },
    clearMyOrders: (state) => {
      state.myOrders = [];
      state.errorMyOrders = null;
    },
    clearMySubOrders: (state) => {
      state.mySubOrders = [];
      state.errorMySubOrders = null;
    },
    clearCreatedOrder: (state) => {
      state.createdOrder = null;
      state.errorCreateOrder = null;
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
      })
      
      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loadingMyOrders = true;
        state.errorMyOrders = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action: PayloadAction<MyOrdersResponse>) => {
        state.loadingMyOrders = false;
        state.myOrders = action.payload || [];
        state.errorMyOrders = null;
        state.success = true;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loadingMyOrders = false;
        state.errorMyOrders = action.payload as string;
        state.success = false;
      })
      
      // Fetch My Sub Orders
      .addCase(fetchMySubOrders.pending, (state) => {
        state.loadingMySubOrders = true;
        state.errorMySubOrders = null;
      })
      .addCase(fetchMySubOrders.fulfilled, (state, action: PayloadAction<MySubOrdersResponse>) => {
        state.loadingMySubOrders = false;
        state.mySubOrders = action.payload.subOrders || [];
        state.errorMySubOrders = null;
        state.success = true;
      })
      .addCase(fetchMySubOrders.rejected, (state, action) => {
        state.loadingMySubOrders = false;
        state.errorMySubOrders = action.payload as string;
        state.success = false;
      })
      
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loadingCreateOrder = true;
        state.errorCreateOrder = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<CreateOrderResponse>) => {
        state.loadingCreateOrder = false;
        state.createdOrder = action.payload;
        state.errorCreateOrder = null;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loadingCreateOrder = false;
        state.errorCreateOrder = action.payload as string;
        state.success = false;
      });
  },
});

export const { 
  clearError, 
  clearUnifiedOrders, 
  clearMyOrders,
  clearMySubOrders,
  clearCreatedOrder,
  setUnifiedOrdersPage, 
  resetOrderState 
} = orderSlice.actions;

export default orderSlice.reducer;
