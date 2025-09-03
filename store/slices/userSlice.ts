import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { userInstance } from '@/services';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null; // Cambio para consistencia con web
  loading: boolean; // Cambio para consistencia con web
  error: string | null;
  isVerified: boolean; // Agregado para consistencia con web
  followed: any[]; // Agregado para consistencia con web
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
  },
});

export const { setUser, clearUser, setLoading, setError, setVerified, addFollowed, removeFollowed } = userSlice.actions;
export default userSlice.reducer;