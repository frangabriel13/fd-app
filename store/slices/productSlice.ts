import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { productInstance } from '@/services';

interface Product {
  id: string;
  type: 'product' | 'service' | 'Vehicle' | 'Real Estate' | 'Other';
  name: string;
  description: string;
  mainImage: string;
  images: string[];
  attributes: Record<string, any>;
  price: number;
  priceUSD?: number;
  salePrice: number;
  isVariable: boolean;
  isActive: boolean;
  isImported: boolean;
  userId: number;
  tags: string[];
  onSale: boolean;
  stock: number;
  logo?: string;
}

interface ProductState {
  featured: Product[];
  newProducts: Product[];
  packs: Product[];
  sales: Product[];
  blanqueria: Product[];
  lenceria: Product[];
  calzado: Product[];
  bisuteria: Product[];
  telas: Product[];
  insumos: Product[];
  maquinas: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  featured: [],
  newProducts: [],
  packs: [],
  sales: [],
  blanqueria: [],
  lenceria: [],
  calzado: [],
  bisuteria: [],
  telas: [],
  insumos: [],
  maquinas: [],
  loading: false,
  error: null,
};

export const fetchMobileHomeProducts = createAsyncThunk(
  'product/fetchMobileHomeProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productInstance.get('/mobile-home');
      return response.data; // Se espera que el backend devuelva un objeto con las secciones
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener los productos');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMobileHomeProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMobileHomeProducts.fulfilled, (state, action: PayloadAction<ProductState>) => {
        state.featured = action.payload.featured;
        state.newProducts = action.payload.newProducts;
        state.packs = action.payload.packs;
        state.sales = action.payload.sales;
        state.blanqueria = action.payload.blanqueria;
        state.lenceria = action.payload.lenceria;
        state.calzado = action.payload.calzado;
        state.bisuteria = action.payload.bisuteria;
        state.telas = action.payload.telas;
        state.insumos = action.payload.insumos;
        state.maquinas = action.payload.maquinas;
        state.loading = false;
      })
      .addCase(fetchMobileHomeProducts.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setLoading, setError } = productSlice.actions;

export default productSlice.reducer;