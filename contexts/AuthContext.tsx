import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setToken } from '@/store/slices/manufacturerSlice';
import { useRouter } from 'expo-router';

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isAuthenticated: false,
  userRole: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector(state => state.auth);
  const router = useRouter();

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        console.log('Stored token:', storedToken);
        if(storedToken) {
          dispatch(setToken(storedToken));
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, [dispatch]);

  // useEffect(() => {
  //   if (!isLoading && !token) {
  //     router.replace('/(auth)/login');
  //   }
  // }, [isLoading, token, router]);

  useEffect(() => {
    if(!isLoading) {
      if(!token) {
        router.replace('/(auth)/login');
      } 
      else if(user?.role === null) {
        router.replace('/(onboarding)/rol');
      }
    }
  }, [isLoading, token, user, router]);

  console.log('userRole:', user?.role);

  return (
    <AuthContext.Provider 
      value={{ 
        isLoading, 
        isAuthenticated: !!token,
        userRole: user?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export const useAuthContext = () => useContext(AuthContext);