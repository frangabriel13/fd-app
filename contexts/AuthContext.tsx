import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { useRouter } from 'expo-router';
import { fetchAuthUser } from '@/store/slices/userSlice';

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
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const { token, user: authUser } = useAppSelector(state => state.auth);
  const { user: myUser } = useAppSelector(state => state.user);
  const router = useRouter();

  console.log('AuthContext - token:', token);
  console.log('user:', authUser);
  console.log('myUser:', myUser);
  
  // Solo esperar a que redux-persist termine de hidratar
  useEffect(() => {
    // Dar tiempo a redux-persist para hidratar el estado
    const timer = setTimeout(async () => {
      if(token) {
        // Llamar a fetchAuthUser si hay un token
        await dispatch(fetchAuthUser());
      }
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [dispatch, token]);
  
  useEffect(() => {
    if(!isLoading) {
      const timeoutId = setTimeout(() => {
        if(!token) {
          router.replace('/(auth)/login');
        } 
        else if(token && myUser && (myUser?.role === null || myUser?.role === undefined)) {
          router.replace('/(onboarding)/rol');
        } 
        else if(token && myUser && myUser?.role) {
          if(myUser?.role === 'manufacturer' && (myUser?.manufacturer?.verificationStatus === 'not_started' ||
            myUser?.manufacturer?.verificationStatus === 'pending'
          )) {
            router.replace('/(onboarding)/validar-documentos');
          }
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, token, authUser, authUser?.role, myUser, router]);
  
  return (
    <AuthContext.Provider 
    value={{ 
      isLoading, 
      isAuthenticated: !!token,
      userRole: authUser?.role || null,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export const useAuthContext = () => useContext(AuthContext);