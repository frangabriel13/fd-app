export const formatToARS = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    // style: 'currency',
    // currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formatea un nick de TikTok para guardarlo en base de datos como URL completa
 * @param input - El nick del usuario (puede incluir @ o no)
 * @returns URL completa de TikTok en formato: https://www.tiktok.com/@{nick}/live
 * @example formatTikTokUrlForStorage('africa_mia') // 'https://www.tiktok.com/@africa_mia/live'
 * @example formatTikTokUrlForStorage('@africa_mia') // 'https://www.tiktok.com/@africa_mia/live'
 */
export const formatTikTokUrlForStorage = (input: string): string => {
  if (!input || input.trim() === '') {
    return '';
  }

  // Limpiar espacios
  const cleanInput = input.trim();

  // Si ya es una URL completa, devolverla tal cual
  if (cleanInput.startsWith('http')) {
    return cleanInput;
  }

  // Quitar @ si existe
  const nick = cleanInput.startsWith('@') ? cleanInput.substring(1) : cleanInput;

  // Retornar URL completa
  return `https://www.tiktok.com/@${nick}/live`;
};

/**
 * Extrae el nick de una URL de TikTok para mostrarlo en el input
 * @param url - URL completa de TikTok
 * @returns Solo el nick sin @ ni URL
 * @example extractTikTokNick('https://www.tiktok.com/@africa_mia/live') // 'africa_mia'
 */
export const extractTikTokNick = (url: string | null | undefined): string => {
  if (!url || url.trim() === '') {
    return '';
  }

  // Si no es una URL, asumir que ya es el nick
  if (!url.startsWith('http')) {
    return url.startsWith('@') ? url.substring(1) : url;
  }

  // Extraer el nick de la URL
  // Formato esperado: https://www.tiktok.com/@{nick}/live
  const match = url.match(/@([^\/]+)/);
  return match ? match[1] : '';
};

/**
 * Formatea un nick de Instagram para guardarlo en base de datos (sin @)
 * @param input - El nick del usuario (puede incluir @ o no)
 * @returns Nick sin arroba
 * @example formatInstagramNickForStorage('@frangabriel.13') // 'frangabriel.13'
 * @example formatInstagramNickForStorage('frangabriel.13') // 'frangabriel.13'
 */
export const formatInstagramNickForStorage = (input: string): string => {
  if (!input || input.trim() === '') {
    return '';
  }

  // Limpiar espacios y quitar @ si existe
  const cleanInput = input.trim();
  return cleanInput.startsWith('@') ? cleanInput.substring(1) : cleanInput;
};

/**
 * Normaliza una descripción de texto preservando saltos de línea pero eliminando espacios excesivos
 * @param input - Texto a normalizar
 * @returns Texto normalizado con saltos de línea preservados
 * @example normalizeDescription('Hola\n\n\nMundo   con   espacios  ') // 'Hola\n\nMundo con espacios'
 */
export const normalizeDescription = (input: string): string => {
  if (!input || input.trim() === '') {
    return '';
  }

  return input
    // Quitar espacios al inicio y final de todo el texto
    .trim()
    // Reducir múltiples espacios consecutivos a uno solo (pero preservar saltos de línea)
    .replace(/ +/g, ' ')
    // Reducir más de 2 saltos de línea consecutivos a solo 2 (para evitar demasiado espacio vertical)
    .replace(/\n{3,}/g, '\n\n')
    // Quitar espacios antes y después de saltos de línea
    .replace(/ *\n */g, '\n');
};