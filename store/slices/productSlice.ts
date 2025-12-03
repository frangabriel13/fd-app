import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { productInstance } from '@/services';
import { Product, Manufacturer, ProductWithManufacturerResponse } from '@/types/product';

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
  currentProduct: Product | null;
  currentManufacturer: Manufacturer | null;
  manufacturerProducts: Pick<Product, 'id' | 'name' | 'price' | 'mainImage'>[];
  categoryProducts: Pick<Product, 'id' | 'name' | 'price' | 'mainImage'>[];
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
  currentProduct: null,
  currentManufacturer: null,
  manufacturerProducts: [],
  categoryProducts: [],
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

export const fetchProductWithManufacturer = createAsyncThunk(
  'product/fetchProductWithManufacturer',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await productInstance.get(`/with-manufacturer/${productId}`);
      return response.data as ProductWithManufacturerResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener el producto con fabricante');
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
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.currentManufacturer = null;
      state.manufacturerProducts = [];
      state.categoryProducts = [];
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
      })
      .addCase(fetchProductWithManufacturer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductWithManufacturer.fulfilled, (state, action: PayloadAction<ProductWithManufacturerResponse>) => {
        state.currentProduct = action.payload.product;
        state.currentManufacturer = action.payload.manufacturer;
        state.manufacturerProducts = action.payload.manufacturerProducts;
        state.categoryProducts = action.payload.categoryProducts;
        state.loading = false;
      })
      .addCase(fetchProductWithManufacturer.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setLoading, setError, clearCurrentProduct } = productSlice.actions;

export default productSlice.reducer;