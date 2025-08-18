import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Instancia específica para operaciones de autenticación (sin interceptores)
const authAxios = axios.create({
  baseURL: 'http://localhost:3001/api/manufacturers',
});

/**
 * Servicio para refrescar el token de autenticación
 * Este servicio es independiente y puede ser usado por cualquier parte de la app
 */
export const refreshTokenService = async (): Promise<string> => {
  try {
    console.log('Refreshing token...');
    const currentToken = await AsyncStorage.getItem('token');
    
    const response = await authAxios.post('/refresh-token', {}, {
      headers: currentToken ? { Authorization: `Bearer ${currentToken}` } : {}
    });
    
    const newToken = response.data.token;
    await AsyncStorage.setItem('token', newToken);
    
    console.log('Token refreshed successfully');
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
