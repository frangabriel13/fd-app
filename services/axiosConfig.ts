import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { store } from '../store';
import { refreshToken } from '../store/slices/manufacturerSlice';

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
  baseURL: 'http://localhost:3001/api/manufacturers',
});
manufacturerInstance.interceptors.request.use(addAuthHeader);

export const userInstance = axios.create({
  baseURL: 'http://localhost:3001/api/users',
});
userInstance.interceptors.request.use(addAuthHeader);

export const productInstance = axios.create({
  baseURL: 'http://localhost:3000/api/products',
});
productInstance.interceptors.request.use(addAuthHeader);

export const authInstance = axios.create({
  baseURL: 'http://localhost:3001/api/auth',
});

export const wholesalerInstance = axios.create({
  baseURL: 'http://localhost:3001/api/wholesalers',
});
wholesalerInstance.interceptors.request.use(addAuthHeader);

export const categoryInstance = axios.create({
  baseURL: 'http://localhost:3000/api/categories',
});

export const sizeInstance = axios.create({
  baseURL: 'http://localhost:3000/api/sizes',
});

export const imageInstance = axios.create({
  baseURL: 'http://localhost:3000/api/images',
});
imageInstance.interceptors.request.use(addAuthHeader);

export const colorInstance = axios.create({
  baseURL: 'http://localhost:3000/api/colors',
});

export const packInstance = axios.create({
  baseURL: 'http://localhost:3000/api/packs',
});
packInstance.interceptors.request.use(addAuthHeader);

export const genderInstance = axios.create({
  baseURL: 'http://localhost:3000/api/genders',
});

export const orderInstance = axios.create({
  baseURL: 'http://localhost:3001/api/orders',
});
orderInstance.interceptors.request.use(addAuthHeader);

export const reviewInstance = axios.create({
  baseURL: 'http://localhost:3001/api/reviews',
});
reviewInstance.interceptors.request.use(addAuthHeader);

export const favoriteInstance = axios.create({
  baseURL: 'http://localhost:3001/api/favorites',
});
favoriteInstance.interceptors.request.use(addAuthHeader);

export const adminInstance = axios.create({
  baseURL: 'http://localhost:3001/api/admin',
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
          // Dispatch la acción de refresh token
          const result = await store.dispatch(refreshToken());
          if (refreshToken.fulfilled.match(result)) {
            const newToken = result.payload;
            originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
            return instance(originalRequest);
          } else {
            throw new Error('Failed to refresh token');
          }
        } catch (err) {
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );
});
