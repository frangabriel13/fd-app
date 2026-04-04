export const SHOP_LIMIT = 16;

export type SortValue = 'featured' | 'newest' | 'most-viewed' | 'price-high' | 'price-low' | 'onSale';

export interface SortOptionConfig {
  value: SortValue;
  label: string;
  icon: string;
}

export const SORT_OPTIONS: SortOptionConfig[] = [
  { value: 'featured',    label: 'Destacados',      icon: 'star-outline'     },
  { value: 'newest',      label: 'Nuevos ingresos', icon: 'time-outline'     },
  { value: 'most-viewed', label: 'Más vistos',       icon: 'eye-outline'      },
  { value: 'price-high',  label: 'Mayor precio',     icon: 'arrow-up'         },
  { value: 'price-low',   label: 'Menor precio',     icon: 'arrow-down'       },
  { value: 'onSale',      label: 'En oferta',        icon: 'pricetag-outline' },
];

export const SORT_LABELS: Record<SortValue, string> = Object.fromEntries(
  SORT_OPTIONS.map((o) => [o.value, o.label])
) as Record<SortValue, string>;
