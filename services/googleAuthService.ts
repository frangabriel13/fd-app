import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { GOOGLE_AUTH_CONFIG } from '@/config/googleAuth';

WebBrowser.maybeCompleteAuthSession();

// Para AuthSession, siempre usamos el webClientId
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export const useGoogleAuth = () => {
  // Forzar el uso del proxy de Expo para desarrollo
  const redirectUri = `https://auth.expo.io/@frangabriel.13/fd-app`;

  console.log('Redirect URI generado:', redirectUri); // Para debugging

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_AUTH_CONFIG.webClientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      prompt: AuthSession.Prompt.SelectAccount, // Forzar selección de cuenta
    },
    discovery
  );

  // Retornar el redirectUri usado en la request para consistencia
  return [request, response, promptAsync, redirectUri] as const;
};

export const exchangeCodeForToken = async (code: string, redirectUri: string) => {
  try {
    const tokenResponse = await AuthSession.exchangeCodeAsync(
      {
        clientId: GOOGLE_AUTH_CONFIG.webClientId,
        code,
        redirectUri,
      },
      discovery
    );
    
    return tokenResponse;
  } catch (error) {
    console.error('Error al intercambiar código por token:', error);
    throw error;
  }
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