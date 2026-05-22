// Stub para integrar analytics del feed Reels (Firebase Analytics, Amplitude, etc).
// Las funciones están vacías a propósito: cuando se decida la herramienta,
// solo se completa este hook sin tocar los componentes que ya lo consumen.

import { useMemo } from 'react';

export interface ReelsAnalytics {
  trackReelsOpened: (productId: number) => void;
  trackReelViewed: (productId: number) => void;
  trackReelCompleted: (productId: number) => void;
  trackReelCtaClicked: (productId: number) => void;
  trackReelsClosed: (videosViewed: number) => void;
}

export function useReelsAnalytics(): ReelsAnalytics {
  return useMemo<ReelsAnalytics>(
    () => ({
      trackReelsOpened: () => {},
      trackReelViewed: () => {},
      trackReelCompleted: () => {},
      trackReelCtaClicked: () => {},
      trackReelsClosed: () => {},
    }),
    []
  );
}
