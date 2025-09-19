import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/redux';
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
  const { token, user } = useAppSelector(state => state.auth);
  const router = useRouter();
  
  // Solo esperar a que redux-persist termine de hidratar
  useEffect(() => {
    // Dar tiempo a redux-persist para hidratar el estado
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    console.log('AuthContext useEffect - isLoading:', isLoading, 'token:', !!token, 'userRole:', user?.role);
    
    if(!isLoading) {
      const timeoutId = setTimeout(() => {
        if(!token) {
          console.log('No token, redirecting to login');
          router.replace('/(auth)/login');
        } else if(token && user && (user?.role === null || user?.role === undefined)) {
          console.log('User has no role, redirecting to onboarding');
          router.replace('/(onboarding)/rol');
        } else if(token && user && user?.role) {
          console.log('User authenticated with role:', user?.role);
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, token, user, user?.role, router]);
  
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
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { useAppDispatch, useAppSelector } from '@/hooks/redux';
// import { setToken } from '@/store/slices/authSlice';
// import { useRouter } from 'expo-router';

// interface AuthContextType {
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   userRole: string | null;
// }

// const AuthContext = createContext<AuthContextType>({
//   isLoading: true,
//   isAuthenticated: false,
//   userRole: null,
// });

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [isLoading, setIsLoading] = useState(true);
//   const dispatch = useAppDispatch();
//   const { token, user } = useAppSelector(state => state.auth);
//   const router = useRouter();

//   useEffect(() => {
//     const loadStoredAuth = async () => {
//       try {
//         const storedToken = await AsyncStorage.getItem('token');
//         console.log('Stored token:', storedToken);
//         if(storedToken) {
//           dispatch(setToken(storedToken));
//         }
//       } catch (error) {
//         console.error('Error loading stored auth:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadStoredAuth();
//   }, [dispatch]);

//   // useEffect(() => {
//   //   if (!isLoading && !token) {
//   //     router.replace('/(auth)/login');
//   //   }
//   // }, [isLoading, token, router]);

//   useEffect(() => {
//     console.log('AuthContext useEffect - isLoading:', isLoading, 'token:', !!token, 'userRole:', user?.role);
    
//     if(!isLoading) {
//       // Usar setTimeout para permitir que el estado se actualice completamente
//       const timeoutId = setTimeout(() => {
//         if(!token) {
//           console.log('No token, redirecting to login');
//           router.replace('/(auth)/login');
//         } else if(token && user && (user?.role === null || user?.role === undefined)) {
//           console.log('User has no role, redirecting to onboarding');
//           router.replace('/(onboarding)/rol');
//         } else if(token && user && user?.role) {
//           console.log('User authenticated with role:', user?.role);
//           // No hacemos nada aquí, el login screen maneja la redirección a tabs
//         }
//       }, 100); // Pequeño delay para permitir que el estado se actualice

//       return () => clearTimeout(timeoutId);
//     }
//   }, [isLoading, token, user, user?.role, router]);

//   console.log('userRole:', user?.role);

//   return (
//     <AuthContext.Provider 
//       value={{ 
//         isLoading, 
//         isAuthenticated: !!token,
//         userRole: user?.role || null,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }


// export const useAuthContext = () => useContext(AuthContext);