import { Platform } from 'react-native';

// Configuración de API según el entorno
const getBaseURL = () => {
  // En desarrollo, detectar si es web o móvil
  if (__DEV__) {
    // En web usar localhost
    if (Platform.OS === 'web') {
      const config = {
        API_URL_3001: 'http://localhost:3001/api',
        API_URL_3000: 'http://localhost:3000/api'
      };
      console.log('🌐 API Config (Web):', config);
      return config;
    } else {
      // En móvil usar la IP local de tu computadora
      const LOCAL_IP = '192.168.1.70'; // Tu IP local
      const config = {
        API_URL_3001: `http://${LOCAL_IP}:3001/api`,
        API_URL_3000: `http://${LOCAL_IP}:3000/api`
      };
      console.log('📱 API Config (Mobile):', config);
      return config;
    }
  } else {
    // En producción usar las URLs de producción
    const config = {
      API_URL_3001: 'https://your-production-api-3001.com/api',
      API_URL_3000: 'https://your-production-api-3000.com/api'
    };
    console.log('🚀 API Config (Production):', config);
    return config;
  }
};

export const API_CONFIG = getBaseURL();

// console.log('API Configuration:', API_CONFIG);
