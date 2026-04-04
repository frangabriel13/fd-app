import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { userInstance } from '@/services';

interface Subscription {
  id: number;
  manufacturerId: number;
  plan: string;
  status: string;
  startDate: string;
  endDate?: string | null;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  role: string | null;
  manufacturer?: Manufacturer | null;
  wholesaler?: Wholesaler | null;
}

interface Manufacturer {
  id: string;
  name: string;
  image: string;
  verificationStatus: string;
  selfie?: string | null;
  dniFront?: string | null;
  dniBack?: string | null;
  role?: string | null;
  live?: boolean;
  owner?: string | null;
  phone?: string | null;
  pointOfSale?: boolean;
  street?: string | null;
  minPurchase?: number | null;
  tiktokUrl?: string | null;
  instagramNick?: string | null;
  description?: string | null;
  subscriptions?: Subscription[];
}

interface Wholesaler {
  id: string;
  name: string;
}

interface UserState {
  user: User | null; // Cambio para consistencia con web
  loading: boolean; // Cambio para consistencia con web
  error: string | null;
  isVerified: boolean; // Agregado para consistencia con web
  followed: any[]; // Agregado para consistencia con web
  manufacturer?: Manufacturer | null; // Agregado para consistencia con web
  wholesaler?: Wholesaler | null; // Agregado para consistencia con web
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  isVerified: false,
  followed: [],
};

export const registerUser = createAsyncThunk(
  'user/register-with-code',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await userInstance.post('/register-with-code', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error al registrar usuario');
    }
  }
);

export const verifyAccount = createAsyncThunk(
  'user/verify-with-code',
  async (credentials: { email: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await userInstance.post('/verify-with-code', credentials);
      return response.data.user;
    } catch(error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al verificar cuenta');
    }
  }
)

export const resendVerificationCode = createAsyncThunk(
  'user/resend-verification-code',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await userInstance.post('/resend-verification-code', { email });
      return response.data.message;
    } catch(error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al reenviar el código de verificación');
    }
  }
);

export const fetchAuthUser = createAsyncThunk(
  'user/fetchAuthUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userInstance.get('/me');
      return response.data;
    } catch(error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener el usuario autenticado');
    }
  }
)

export const fetchFollowedManufacturers = createAsyncThunk(
  'user/fetchFollowedManufacturers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userInstance.get('/followed-manufacturers');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener fabricantes seguidos');
    }
  }
);

export const followManufacturer = createAsyncThunk(
  'user/followManufacturer',
  async ({ manufacturerId, manufacturer }: { manufacturerId: string; manufacturer: any }, { rejectWithValue }) => {
    try {
      await userInstance.post(`/follow/${manufacturerId}`);
      return manufacturer;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al seguir fabricante');
    }
  }
);

export const unfollowManufacturer = createAsyncThunk(
  'user/unfollowManufacturer',
  async (manufacturerId: string, { rejectWithValue }) => {
    try {
      const response = await userInstance.delete(`/unfollow/${manufacturerId}`);
      return response.data.id as number;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al dejar de seguir fabricante');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setVerified: (state, action: PayloadAction<boolean>) => {
      state.isVerified = action.payload;
    },
    addFollowed: (state, action: PayloadAction<any>) => {
      state.followed.push(action.payload);
    },
    removeFollowed: (state, action: PayloadAction<string>) => {
      state.followed = state.followed.filter(item => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // resendVerificationCode
      .addCase(resendVerificationCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendVerificationCode.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resendVerificationCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // verifyAccount
      .addCase(verifyAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyAccount.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchAuthUser
      .addCase(fetchAuthUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchAuthUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchFollowedManufacturers
      .addCase(fetchFollowedManufacturers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowedManufacturers.fulfilled, (state, action) => {
        state.loading = false;
        state.followed = action.payload;
        state.error = null;
      })
      .addCase(fetchFollowedManufacturers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // followManufacturer
      .addCase(followManufacturer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followManufacturer.fulfilled, (state, action) => {
        state.loading = false;
        state.followed.push(action.payload);
        state.error = null;
      })
      .addCase(followManufacturer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // unfollowManufacturer
      .addCase(unfollowManufacturer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowManufacturer.fulfilled, (state, action) => {
        state.loading = false;
        state.followed = state.followed.filter(item => item.id !== action.payload);
        state.error = null;
      })
      .addCase(unfollowManufacturer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUser, setLoading, setError, setVerified, addFollowed, removeFollowed } = userSlice.actions;
export default userSlice.reducer;