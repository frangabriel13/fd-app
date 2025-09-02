import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authInstance } from '@/services';

// Tipos
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthError {
  message: string;
  info?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: AuthError | null;
}

// Estado inicial
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authInstance.post('/login', credentials);
      const { user, token } = response.data;

      await AsyncStorage.setItem('token', token);
      return { user, token };
    } catch (error: any) {
      // return rejectWithValue({
      //   message: error.response?.data?.message || 'Error al iniciar sesión',
      //   info: error.response?.data?.info || null,
      // });
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      const errorInfo = error.response?.data?.info || null;

      if(errorMessage === 'El email aún no ha sido verificado') {
        return rejectWithValue({ message: errorMessage, info: errorInfo });
      } else {
        return rejectWithValue({ message: errorMessage });
      }
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (googleData: { idToken: string; email: string; name: string; photo: string }, { rejectWithValue }) => {
    try {
      const response = await authInstance.post('/google-login', {
        idToken: googleData.idToken,
        email: googleData.email,
        name: googleData.name,
        photo: googleData.photo,
      });
      
      const { user, token } = response.data;

      await AsyncStorage.setItem('token', token);
      return { user, token };
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Error al iniciar sesión con Google',
        info: error.response?.data?.info || null,
      });
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authInstance.post('/logout');
      await AsyncStorage.removeItem('token');
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Error al cerrar sesión',
        info: error.response?.data?.info || null,
      });
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as AuthError;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as AuthError;
      })
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as AuthError;
      });
  },
});


export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;