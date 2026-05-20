import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configuración de Google Sign-In
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    // webClientId del proyecto Firebase (Android + backend)
    webClientId: '378911157109-9n1bjfra29k7uv3qr78tdmdoaffja56b.apps.googleusercontent.com',

    // Configuraciones adicionales
    offlineAccess: true, // Para obtener refresh token
    hostedDomain: '', // Especifica un dominio específico si es necesario
    forceCodeForRefreshToken: true, // Para forzar el código de actualización
    accountName: '', // Especifica una cuenta específica si es necesario

    // OAuth Client ID iOS — generar en Google Cloud Console (mismo proyecto Firebase)
    // y reemplazar IOS_CLIENT_ID_PLACEHOLDER por el valor real con sufijo .apps.googleusercontent.com
    iosClientId: 'IOS_CLIENT_ID_PLACEHOLDER.apps.googleusercontent.com',

    scopes: ['profile', 'email'], // Alcances que necesitas
  });
};

export { GoogleSignin };
