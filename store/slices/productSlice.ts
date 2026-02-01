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

interface MyProductsPagination {
  currentPage: number;
  pageSize: number;
  myTotalProducts: number;
}

interface MyProduct extends Pick<Product, 'id' | 'name' | 'price' | 'mainImage' | 'userId' | 'onSale' | 'priceUSD' | 'type' | 'isVariable' | 'tags' | 'description' | 'createdAt'> {
  category?: {
    id: number;
    name: string;
    parent?: {
      id: number;
      name: string;
    };
  };
  inventories?: {
    id: number;
    size: string;
    color: string;
    stock: number;
  }[];
  gender?: {
    id: number;
    name: string;
  };
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

interface UpdateSimpleProductData {
  name: string;
  description?: string;
  price: number;
  priceUSD?: number;
  onSale?: boolean;
  tags?: string[];
  mainImage: string;
  images?: string[];
  imgIds?: number[];
  sizes?: number[];
  isVariable: false;
}

interface UpdateVariableProductData {
  name: string;
  description?: string;
  price: number;
  priceUSD?: number;
  onSale?: boolean;
  tags?: string[];
  mainImage: string;
  images?: string[];
  imgIds?: number[];
  sizes?: number[];
  genderId: number;
  categoryId: number;
  isVariable: true;
  variations: {
    colorId: number;
    mainImage: string;
    images?: string[];
  }[];
}

type UpdateProductData = UpdateSimpleProductData | UpdateVariableProductData;

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
  myProducts: MyProduct[];
  myProductsPagination: MyProductsPagination | null;
  myProductsLoading: boolean;
  createdProduct: Product | null;
  isCreating: boolean;
  createError: string | null;
  updatedProduct: Product | null;
  isUpdating: boolean;
  updateError: string | null;
  isDeleting: boolean;
  deleteError: string | null;
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
  myProducts: [],
  myProductsPagination: null,
  myProductsLoading: false,
  createdProduct: null,
  isCreating: false,
  createError: null,
  updatedProduct: null,
  isUpdating: false,
  updateError: null,
  isDeleting: false,
  deleteError: null,
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

export const fetchMyProducts = createAsyncThunk(
  'product/fetchMyProducts',
  async ({ page = 1, pageSize = 10, sortBy, append = false }: {
    page?: number;
    pageSize?: number;
    sortBy?: 'oldest' | 'price-low' | 'price-high' | 'name-asc' | 'name-desc';
    append?: boolean;
  }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());
      if (sortBy) params.append('sortBy', sortBy);

      console.log('Obteniendo mis productos con params:', params.toString());
      const response = await productInstance.get(`/createdbyMe?${params.toString()}`);
      return { ...response.data, append };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener mis productos');
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

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ productId, productData }: { productId: string; productData: UpdateProductData }, { rejectWithValue }) => {
    try {
      console.log('Actualizando producto:', productId, productData);
      const response = await productInstance.put(`/${productId}`, productData);
      return response.data as Product;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar el producto');
    }
  }
);

// Nota importante: esta acción elimina TODOS los productos asociados a un usuario específico
export const deleteProductsByUserId = createAsyncThunk(
  'product/deleteProductsByUserId',
  async (userId: string, { rejectWithValue }) => {
    try {
      console.log('Eliminando productos del usuario:', userId);
      const response = await productInstance.delete(`/by-user/${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar los productos');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (productId: string, { rejectWithValue }) => {
    try {
      console.log('Eliminando producto:', productId);
      const response = await productInstance.delete(`/${productId}`);
      return { productId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar el producto');
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
    clearMyProducts: (state) => {
      state.myProducts = [];
      state.myProductsPagination = null;
      state.myProductsLoading = false;
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
    clearUpdatedProduct: (state) => {
      state.updatedProduct = null;
      state.updateError = null;
    },
    resetUpdateState: (state) => {
      state.updatedProduct = null;
      state.isUpdating = false;
      state.updateError = null;
    },
    resetDeleteState: (state) => {
      state.isDeleting = false;
      state.deleteError = null;
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
      })
      .addCase(updateProduct.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
        state.updatedProduct = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.updatedProduct = action.payload;
        state.isUpdating = false;
        state.updateError = null;
        // Actualizar el producto en myProducts si existe
        const index = state.myProducts.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.myProducts[index] = { ...state.myProducts[index], ...action.payload };
        }
      })
      .addCase(updateProduct.rejected, (state, action: PayloadAction<any>) => {
        state.updateError = action.payload;
        state.isUpdating = false;
        state.updatedProduct = null;
      })
      .addCase(fetchMyProducts.pending, (state) => {
        state.myProductsLoading = true;
        state.error = null;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action: PayloadAction<{
        myProducts: MyProduct[];
        currentPage: number;
        pageSize: number;
        myTotalProducts: number;
        append: boolean;
      }>) => {
        if (action.payload.append) {
          // Filtrar productos duplicados antes de agregar
          const existingIds = state.myProducts.map(p => p.id);
          const newProducts = action.payload.myProducts.filter(p => !existingIds.includes(p.id));
          state.myProducts = [...state.myProducts, ...newProducts];
        } else {
          // Reemplazar toda la lista de productos
          state.myProducts = action.payload.myProducts;
        }
        state.myProductsPagination = {
          currentPage: action.payload.currentPage,
          pageSize: action.payload.pageSize,
          myTotalProducts: action.payload.myTotalProducts
        };
        state.myProductsLoading = false;
      })
      .addCase(fetchMyProducts.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.myProductsLoading = false;
      })
      .addCase(deleteProductsByUserId.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteProductsByUserId.fulfilled, (state) => {
        state.isDeleting = false;
        state.deleteError = null;
        // Limpiar la lista de productos ya que fueron eliminados
        state.myProducts = [];
        state.myProductsPagination = null;
      })
      .addCase(deleteProductsByUserId.rejected, (state, action: PayloadAction<any>) => {
        state.deleteError = action.payload;
        state.isDeleting = false;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<{ productId: string }>) => {
        state.isDeleting = false;
        state.deleteError = null;
        // Remover el producto eliminado de la lista
        state.myProducts = state.myProducts.filter(p => p.id !== action.payload.productId);
        // Actualizar el total si existe paginación
        if (state.myProductsPagination) {
          state.myProductsPagination.myTotalProducts = Math.max(0, state.myProductsPagination.myTotalProducts - 1);
        }
      })
      .addCase(deleteProduct.rejected, (state, action: PayloadAction<any>) => {
        state.deleteError = action.payload;
        state.isDeleting = false;
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
  clearMyProducts,
  clearCreatedProduct,
  resetCreateState,
  clearUpdatedProduct,
  resetUpdateState,
  resetDeleteState
} = productSlice.actions;

export default productSlice.reducer;