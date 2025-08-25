import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { GOOGLE_AUTH_CONFIG } from '@/config/googleAuth';

WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'fdapp', // Usa el nombre de tu proyecto
});

export const useGoogleAuth = () => {
  const clientId = Platform.select({
    ios: GOOGLE_AUTH_CONFIG.iosClientId,
    android: GOOGLE_AUTH_CONFIG.androidClientId,
    default: GOOGLE_AUTH_CONFIG.webClientId,
  });

  return AuthSession.useAuthRequest(
    {
      clientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' }
  );
};

export const exchangeGoogleTokenForBackendAuth = async (accessToken: string) => {
  // Esta función enviará el token a tu backend para validarlo
  try {
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al validar token con el backend:', error);
    throw new Error('Error al validar token con el backend');
  }
};