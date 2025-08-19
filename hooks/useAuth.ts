import { useEffect } from 'react';
import { router, useSegments } from 'expo-router';
import { useAppSelector } from './redux';

export function useAuth() {
  const { token, currentManufacturer } = useAppSelector(state => state.manufacturer);
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    
    if (!token && !inAuthGroup) {
      // Redirigir a login si no está autenticado
      router.replace('/(auth)/login');
    } else if (token && inAuthGroup) {
      // Redirigir a tabs si ya está autenticado
      router.replace('/(tabs)');
    }
  }, [token, segments]);

  return {
    isAuthenticated: !!token,
    user: currentManufacturer,
  };
}