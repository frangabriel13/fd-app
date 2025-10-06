import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_CONFIG } from '@/constants/ApiConfig';

// Instancia específica para operaciones de autenticación (sin interceptores)
const manufacturerAxios = axios.create({
  baseURL: `${API_CONFIG.API_URL_3001}/manufacturers`,
});

// Función para obtener el token, similar a la de axiosConfig.ts
const getAuthToken = async () => {
  try {
    // Intentar obtener desde Redux store primero
    const { store } = await import('@/store');
    const state = store.getState();
    const token = state.auth?.token;
    return token || null;
  } catch {
    // Fallback a AsyncStorage si hay problemas con Redux
    console.warn('⚠️ Could not get token from Redux store, falling back to AsyncStorage');
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (asyncError) {
      console.error('❌ Error getting token from AsyncStorage:', asyncError);
      return null;
    }
  }
};

/**
 * Servicio para refrescar el token de autenticación
 * Este servicio es independiente y puede ser usado por cualquier parte de la app
 */
export const refreshTokenService = async (): Promise<string> => {
  try {
    const currentToken = await getAuthToken();
    
    if (!currentToken) {
      throw new Error('No token found for refresh');
    }
    
    const headers = { Authorization: `Bearer ${currentToken}` };
    
    const response = await manufacturerAxios.post('/refresh-token', {}, {
      headers
    });
    
    const newToken = response.data.token;
    
    // Guardar el nuevo token en AsyncStorage
    await AsyncStorage.setItem('token', newToken);
    
    // También intentar actualizar Redux store si está disponible
    try {
      const { store } = await import('@/store');
      const { setToken } = await import('@/store/slices/authSlice');
      store.dispatch(setToken(newToken));
    } catch {
      console.warn('⚠️ Could not update Redux store, token saved in AsyncStorage only');
    }
    
    return newToken;
  } catch (error: any) {
    console.error('Error refreshing token:', error);
    // Limpiar token si falla el refresh
    await AsyncStorage.removeItem('token');
    throw new Error(error.response?.data?.message || 'Error refreshing token');
  }
};

/**
 * Servicio para hacer logout y limpiar datos
 */
export const logoutService = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('token');
    // Aquí podrías agregar más limpieza si es necesario
  } catch (error) {
    console.error('Error during logout:', error);
  }
};
