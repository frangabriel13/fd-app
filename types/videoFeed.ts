// Tipos del feed de videos de productos servido por GET /api/videos/feed.
// El backend cura el orden (70% más vendidos, 20% recientes, 10% random) y dedupea por manufacturer.

export interface VideoFeedItem {
  id: number;
  name: string;
  videoUrl: string;
  mainImage: string;
  price: string;
  priceUSD: string;
  userId: number;
  createdAt: string;
  logo: string | null;
  // Manufacturer.id (NO Manufacturer.userId). Lo necesita el cliente para
  // navegar a /(tabs)/store/[id] al tocar el logo en un reel.
  manufacturerId?: number | null;
  manufacturerName?: string | null;
}

export interface VideoFeedResponse {
  videos: VideoFeedItem[];
  currentPage: number;
  pageSize: number;
  totalVideos: number;
  seed: string;
}

export interface VideoFeedParams {
  page?: number;
  pageSize?: number;
  // Semilla que fija el orden aleatorio entre páginas de la misma sesión.
  // Si no se manda, el backend genera una y la devuelve en la respuesta.
  seed?: string;
  // Si se manda, ese productId aparece en la posición 0 del primer lote.
  startWith?: number;
}
