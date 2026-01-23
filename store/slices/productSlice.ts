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

interface SearchInfo {
  searchTerm: string;
  directMatches: number;
  manufacturerMatches: number;
  totalMatches: number;
}

interface ShopFilters {
  genderId: number | null;
  categoryId: number | null;
  searchTerm: string | null;
}

interface StorePagination {
  currentPage: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface StoreProduct extends Pick<Product, 'id' | 'name' | 'price' | 'mainImage'> {}

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

interface SearchResultProduct {
  id: string;
  name: string;
}

interface SearchResultManufacturer {
  id: string;
  name: string;
  userId: string;
}

interface SearchResults {
  product: SearchResultProduct[];
  user: SearchResultManufacturer[];
}

interface CreateSimpleProductData {
  name: string;
  description?: string;
  price: number;
  priceUSD?: number;
  onSale?: boolean;
  tags?: string[];
  mainImage: string;
  images?: string[];
  imgIds?: number[];
  sizes: number[];
  genderId: number;
  categoryId: number;
  isVariable: false;
}

interface CreateVariableProductData {
  name: string;
  description?: string;
  price: number;
  priceUSD?: number;
  onSale?: boolean;
  tags?: string[];
  mainImage: string;
  images?: string[];
  imgIds?: number[];
  sizes: number[];
  genderId: number;
  categoryId: number;
  isVariable: true;
  variations: {
    colorId: number;
    mainImage: string;
    images?: string[];
  }[];
}

type CreateProductData = CreateSimpleProductData | CreateVariableProductData;

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
  searchInfo: SearchInfo | null;
  storeProducts: StoreProduct[];
  storePagination: StorePagination | null;
  searchResults: SearchResults | null;
  searchLoading: boolean;
  createdProduct: Product | null;
  isCreating: boolean;
  createError: string | null;
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
  searchInfo: null,
  storeProducts: [],
  storePagination: null,
  searchResults: null,
  searchLoading: false,
  createdProduct: null,
  isCreating: false,
  createError: null,
  loading: false,
  error: null,
};

export const fetchShopProducts = createAsyncThunk(
  'product/fetchShopProducts',
  async ({ genderId, categoryId, searchTerm, page = 1, limit = 10, append = false }: {
    genderId?: number;
    categoryId?: number;
    searchTerm?: string;
    page?: number;
    limit?: number;
    append?: boolean;
  }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (genderId) params.append('genderId', genderId.toString());
      if (categoryId) params.append('categoryId', categoryId.toString());
      if (searchTerm) params.append('searchTerm', searchTerm);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      console.log('llamando al backend con params:', params.toString());
      const response = await productInstance.get(`/shop?${params.toString()}`);
      return { ...response.data, append };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener los productos de la tienda');
    }
  }
);

export const fetchStoreProducts = createAsyncThunk(
  'product/fetchStoreProducts',
  async ({ userId, page = 1, limit = 10, append = false }: {
    userId: string;
    page?: number;
    limit?: number;
    append?: boolean;
  }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      console.log(`Obteniendo productos del fabricante ${userId} con params:`, params.toString());
      const response = await productInstance.get(`/store/${userId}?${params.toString()}`);
      return { ...response.data, append };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener los productos del fabricante');
    }
  }
);

export const fetchSearchResults = createAsyncThunk(
  'product/fetchSearchResults',
  async (search: string, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('search', search);

      console.log('Realizando búsqueda global con término:', search);
      const response = await productInstance.get(`/results-search?${params.toString()}`);
      return response.data as SearchResults;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al realizar la búsqueda');
    }
  }
);

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (productData: CreateProductData, { rejectWithValue }) => {
    try {
      console.log('Creando producto:', productData);
      const response = await productInstance.post('/', productData);
      return response.data as Product;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear el producto');
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
      state.searchInfo = null;
    },
    resetShopFilters: (state) => {
      state.shopFilters = {
        genderId: null,
        categoryId: null,
        searchTerm: null
      };
    },
    clearStoreProducts: (state) => {
      state.storeProducts = [];
      state.storePagination = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = null;
      state.searchLoading = false;
    },
    clearCreatedProduct: (state) => {
      state.createdProduct = null;
      state.createError = null;
    },
    resetCreateState: (state) => {
      state.createdProduct = null;
      state.isCreating = false;
      state.createError = null;
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
        searchInfo?: SearchInfo;
        append: boolean;
      }>) => {
        if (action.payload.append) {
          // Filtrar productos duplicados antes de agregar
          const existingIds = state.shopProducts.map(p => p.id);
          const newProducts = action.payload.products.filter(p => !existingIds.includes(p.id));
          state.shopProducts = [...state.shopProducts, ...newProducts];
        } else {
          // Reemplazar toda la lista de productos
          state.shopProducts = action.payload.products;
        }
        state.shopPagination = action.payload.pagination;
        state.shopFilters = action.payload.filters;
        state.searchInfo = action.payload.searchInfo || null;
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
      })
      .addCase(fetchStoreProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreProducts.fulfilled, (state, action: PayloadAction<{
        products: StoreProduct[];
        pagination: StorePagination;
        append: boolean;
      }>) => {
        if (action.payload.append) {
          // Filtrar productos duplicados antes de agregar
          const existingIds = state.storeProducts.map(p => p.id);
          const newProducts = action.payload.products.filter(p => !existingIds.includes(p.id));
          state.storeProducts = [...state.storeProducts, ...newProducts];
        } else {
          // Reemplazar toda la lista de productos
          state.storeProducts = action.payload.products;
        }
        state.storePagination = action.payload.pagination;
        state.loading = false;
      })
      .addCase(fetchStoreProducts.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchSearchResults.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action: PayloadAction<SearchResults>) => {
        state.searchResults = action.payload;
        state.searchLoading = false;
      })
      .addCase(fetchSearchResults.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.searchLoading = false;
        state.searchResults = null;
      })
      .addCase(createProduct.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
        state.createdProduct = null;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.createdProduct = action.payload;
        state.isCreating = false;
        state.createError = null;
        // Opcional: agregar el producto creado a las listas correspondientes si es necesario
        // state.newProducts.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action: PayloadAction<any>) => {
        state.createError = action.payload;
        state.isCreating = false;
        state.createdProduct = null;
      });
  },
});

export const { 
  setLoading, 
  setError, 
  clearCurrentProduct, 
  setShopFilters, 
  clearShopProducts, 
  resetShopFilters, 
  clearStoreProducts, 
  clearSearchResults,
  clearCreatedProduct,
  resetCreateState
} = productSlice.actions;

export default productSlice.reducer;