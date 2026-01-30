import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { wholesalerInstance } from '../../services/axiosConfig';

interface Wholesaler {
  id: number;
  name: string;
  phone: string;
  userId: number;
}

interface WholesalerState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: WholesalerState = {
  loading: false,
  success: false,
  error: null,
}

export const createWholesaler = createAsyncThunk(
  'wholesaler/createWholesaler',
  async (wholesalerData: { name: string; phone: string, userId: number }, { rejectWithValue }) => {
    try {
      console.log('Creating wholesaler with data:', wholesalerData);
      const response = await wholesalerInstance.post('/', wholesalerData);
      return response.data;
    } catch(error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear mayorista');
    }
  }
);

export const updateWholesaler = createAsyncThunk(
  'wholesaler/updateWholesaler',
  async (
    { id, name, phone, street, city, province, postalCode, country }: {
      id: number;
      name?: string;
      phone?: string;
      street?: string;
      city?: string;
      province?: string;
      postalCode?: string;
      country?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      console.log('Updating wholesaler with data:', { id, name, phone, street, city, province, postalCode, country });
      const response = await wholesalerInstance.put(`/${id}`, {
        name,
        phone,
        street,
        city,
        province,
        postalCode,
        country,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar mayorista');
    }
  }
);

const wholesalerSlice = createSlice({
  name: 'wholesaler',
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createWholesaler.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createWholesaler.fulfilled, (state, action: PayloadAction<Wholesaler>) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(createWholesaler.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string || 'Error al crear mayorista';
      })
      .addCase(updateWholesaler.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateWholesaler.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(updateWholesaler.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string || 'Error al actualizar mayorista';
      });
  }
})


export const { resetState } = wholesalerSlice.actions;
export default wholesalerSlice.reducer;