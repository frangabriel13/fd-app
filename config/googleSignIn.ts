import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configuración de Google Sign-In
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    // Necesitas reemplazar este webClientId con el tuyo de Google Console
    webClientId: '378911157109-9n1bjfra29k7uv3qr78tdmdoaffja56b.apps.googleusercontent.com',
    
    // Configuraciones adicionales
    offlineAccess: true, // Para obtener refresh token
    hostedDomain: '', // Especifica un dominio específico si es necesario
    forceCodeForRefreshToken: true, // Para forzar el código de actualización
    accountName: '', // Especifica una cuenta específica si es necesario
    iosClientId: '', // Para iOS (opcional por ahora)
    googleServicePlistPath: '', // Para iOS (opcional por ahora)
    scopes: ['profile', 'email'], // Alcances que necesitas
  });
};

export { GoogleSignin };
