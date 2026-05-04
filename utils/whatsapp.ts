import { Linking } from 'react-native';

const WHATSAPP_NUMBER = '5491130415773';
const WHATSAPP_DEFAULT_MESSAGE = 'Hola! Tengo una consulta sobre Fabricante Directo.';

export const contactarSoporte = (message: string = WHATSAPP_DEFAULT_MESSAGE) => {
  Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);
};

// Normaliza un teléfono argentino: quita no-dígitos y antepone 54 si falta
export const normalizeArgPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('54') ? digits : `54${digits}`;
};
