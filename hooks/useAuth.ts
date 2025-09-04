import { useEffect } from 'react';
import { router, useSegments } from 'expo-router';
import { useAppSelector } from './redux';

export function useAuth() {
  const { token, user, isAuthenticated } = useAppSelector(state => state.auth);
  const segments = useSegments();

  // console.log('Current segments:', segments);
  // console.log('Current user:', user);
  // console.log('Is authenticated:', isAuthenticated);
  // console.log('Current token:', token);

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
    isAuthenticated,
    user,
  };
}