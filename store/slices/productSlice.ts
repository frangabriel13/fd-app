import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { productInstance } from '@/services';
import { Product, Manufacturer, ProductWithManufacturerResponse } from '@/types/product';

interface ShopPagination {
  currentPage: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ShopFilters {
  genderId: number | null;
  categoryId: number | null;
  searchTerm: string | null;
}

interface ShopProduct extends Pick<Product, 'id' | 'name' | 'price' | 'mainImage' | 'userId' | 'priceUSD' | 'onSale' | 'description'> {
  logo?: string | null;
  category?: {
    id: number;
    name: string;
    parentId?: number;
  };
  gender?: {
    id: number;
    name: string;
  };
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
  currentProduct: Product | null;
  currentManufacturer: Manufacturer | null;
  manufacturerProducts: Pick<Product, 'id' | 'name' | 'price' | 'mainImage'>[];
  categoryProducts: Pick<Product, 'id' | 'name' | 'price' | 'mainImage'>[];
  shopProducts: ShopProduct[];
  shopPagination: ShopPagination | null;
  shopFilters: ShopFilters;
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
  shopProducts: [],
  shopPagination: null,
  shopFilters: {
    genderId: null,
    categoryId: null,
    searchTerm: null
  },
  loading: false,
  error: null,
};

export const fetchShopProducts = createAsyncThunk(
  'product/fetchShopProducts',
  async ({ genderId, categoryId, searchTerm, page = 1, limit = 10 }: {
    genderId?: number;
    categoryId?: number;
    searchTerm?: string;
    page?: number;
    limit?: number;
  }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (genderId) params.append('genderId', genderId.toString());
      if (categoryId) params.append('categoryId', categoryId.toString());
      if (searchTerm) params.append('searchTerm', searchTerm);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await productInstance.get(`/shop?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener los productos de la tienda');
    }
  }
);

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
    setShopFilters: (state, action: PayloadAction<Partial<ShopFilters>>) => {
      state.shopFilters = { ...state.shopFilters, ...action.payload };
    },
    clearShopProducts: (state) => {
      state.shopProducts = [];
      state.shopPagination = null;
    },
    resetShopFilters: (state) => {
      state.shopFilters = {
        genderId: null,
        categoryId: null,
        searchTerm: null
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShopProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopProducts.fulfilled, (state, action: PayloadAction<{
        products: ShopProduct[];
        pagination: ShopPagination;
        filters: ShopFilters;
      }>) => {
        state.shopProducts = action.payload.products;
        state.shopPagination = action.payload.pagination;
        state.shopFilters = action.payload.filters;
        state.loading = false;
      })
      .addCase(fetchShopProducts.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      })
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

export const { setLoading, setError, clearCurrentProduct, setShopFilters, clearShopProducts, resetShopFilters } = productSlice.actions;

export default productSlice.reducer;