import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { refreshTokenService } from './authService';
import { API_CONFIG } from '@/constants/ApiConfig';

const addAuthHeader = async (config: any) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error getting token from AsyncStorage:', error);
    return config;
  }
};

export const manufacturerInstance = axios.create({
  baseURL: `${API_CONFIG.API_URL_3001}/manufacturers`,
});
manufacturerInstance.interceptors.request.use(addAuthHeader);

export const userInstance = axios.create({
  baseURL: `${API_CONFIG.API_URL_3001}/users`,
});
userInstance.interceptors.request.use(addAuthHeader);

export const productInstance = axios.create({
  baseURL: `${API_CONFIG.API_URL_3000}/products`,
});
productInstance.interceptors.request.use(addAuthHeader);

export const authInstance = axios.create({
  baseURL: `${API_CONFIG.API_URL_3001}/auth`,
});

export const wholesalerInstance = axios.create({
  baseURL: `${API_CONFIG.API_URL_3001}/wholesalers`,
});
wholesalerInstance.interceptors.request.use(addAuthHeader);

export const categoryInstance = axios.create({
  baseURL: `${API_CONFIG.API_URL_3000}/categories`,
});

export const sizeInstance = axios.create({
  baseURL: `${API_CONFIG.API_URL_3000}/sizes`,
});

export const imageInstance = axios.create({
  baseURL: `${API_CONFIG.API_URL_3000}/images`,
});
imageInstance.interceptors.request.use(addAuthHeader);

export const colorInstance = axios.create({
  baseURL: `${API_CONFIG.API_URL_3000}/colors`,
});

export const packInstance = axios.create({
  baseURL: `${API_CONFIG.API_URL_3000}/packs`,
});
packInstance.interceptors.request.use(addAuthHeader);

export const genderInstance = axios.create({
  baseURL: `${API_CONFIG.API_URL_3000}/genders`,
});

export const orderInstance = axios.create({
  baseURL: `${API_CONFIG.API_URL_3001}/orders`,
});
orderInstance.interceptors.request.use(addAuthHeader);

export const reviewInstance = axios.create({
  baseURL: `${API_CONFIG.API_URL_3001}/reviews`,
});
reviewInstance.interceptors.request.use(addAuthHeader);

export const favoriteInstance = axios.create({
  baseURL: `${API_CONFIG.API_URL_3001}/favorites`,
});
favoriteInstance.interceptors.request.use(addAuthHeader);

export const adminInstance = axios.create({
  baseURL: `${API_CONFIG.API_URL_3001}/admin`,
});
adminInstance.interceptors.request.use(addAuthHeader);

const instancesWithAuth = [
  manufacturerInstance,
  userInstance,
  productInstance,
  wholesalerInstance,
  imageInstance,
  packInstance,
  orderInstance,
  reviewInstance,
  favoriteInstance,
  adminInstance
];

instancesWithAuth.forEach(instance => {
  instance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = await refreshTokenService();
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return instance(originalRequest);
        } catch (err) {
          // Si falla el refresh, redirigir a login o mostrar error
          console.error('Failed to refresh token, redirecting to login');
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );
});
