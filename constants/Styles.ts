// Constantes de diseño para mantener consistencia
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
} as const;

// Clases de utilidad comunes como strings para usar con className
export const commonStyles = {
  // Flexbox
  flexCenter: 'flex-1 justify-center items-center',
  flexRow: 'flex-row items-center',
  flexBetween: 'flex-row justify-between items-center',
  
  // Espaciado
  screenPadding: 'px-4 py-6',
  sectionSpacing: 'py-4',
  
  // Tipografía
  textCenter: 'text-center',
  textBold: 'font-mont-bold',
  textMedium: 'font-mont-medium',
  textRegular: 'font-mont-regular',
  
  // Colores comunes
  textPrimary: 'text-primary',
  textSecondary: 'text-secondary',
  textGray: 'text-gray-600',
  textWhite: 'text-white',
  
  // Botones base
  buttonPrimary: 'bg-primary px-6 py-3 rounded-lg items-center justify-center',
  buttonSecondary: 'bg-secondary px-6 py-3 rounded-lg items-center justify-center',
  buttonOutline: 'border-2 border-primary px-6 py-3 rounded-lg items-center justify-center',
  
  // Cards
  card: 'bg-white rounded-lg p-4 shadow-sm',
  cardElevated: 'bg-white rounded-lg p-4 shadow-lg',
} as const;
