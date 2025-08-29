import { useState, useEffect } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { configureGoogleSignIn } from '@/config/googleSignIn';

export const useGoogleSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Configurar Google Sign-In cuando se monta el componente
    configureGoogleSignIn();
  }, []);

  const signIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Verificar si hay servicios de Google Play disponibles
      await GoogleSignin.hasPlayServices();

      // Iniciar el flujo de inicio de sesión
      const userInfo = await GoogleSignin.signIn();
      
      console.log('Usuario autenticado:', userInfo);
      return userInfo;

    } catch (error: any) {
      setIsLoading(false);
      
      let errorMessage = 'Error al iniciar sesión con Google';
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = 'Inicio de sesión cancelado';
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Inicio de sesión en progreso';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Google Play Services no disponible';
      } else {
        errorMessage = error.message || 'Error desconocido';
      }
      
      setError(errorMessage);
      console.error('Error Google Sign-In:', error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      console.log('Usuario desconectado');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const getCurrentUser = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      return userInfo;
    } catch (error: any) {
      console.log('No hay usuario autenticado:', error?.message);
      return null;
    }
  };

  return {
    signIn,
    signOut,
    getCurrentUser,
    isLoading,
    error,
  };
};
