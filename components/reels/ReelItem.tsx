import React, { memo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { VideoFeedItem } from '@/types/videoFeed';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ReelItemProps {
  item: VideoFeedItem;
  index: number;
  activeIndex: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onCtaPress: (productId: number) => void;
}

// Sub-componente que monta el player real. Solo se renderiza cuando el slide
// está dentro de la "ventana" cercana al activeIndex; fuera de eso queda como
// poster estático para liberar memoria/decoders.
const VideoLayer = memo(function VideoLayer({
  videoUrl,
  isActive,
  isMuted,
}: {
  videoUrl: string;
  isActive: boolean;
  isMuted: boolean;
}) {
  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = true;
    p.muted = isMuted;
    if (isActive) p.play();
  });

  // Sincroniza play/pause y mute con los props cuando cambian.
  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
      try {
        player.currentTime = 0;
      } catch {
        // expo-video puede tirar si el player aún no cargó; lo ignoramos.
      }
    }
  }, [isActive, player]);

  useEffect(() => {
    player.muted = isMuted;
  }, [isMuted, player]);

  return (
    <VideoView
      player={player}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      nativeControls={false}
      allowsPictureInPicture={false}
    />
  );
});

const ReelItem: React.FC<ReelItemProps> = ({
  item,
  index,
  activeIndex,
  isMuted,
  onToggleMute,
  onCtaPress,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Ventana de carga: el video activo y sus vecinos inmediatos mantienen player.
  // Más lejos: solo poster estático.
  const distance = Math.abs(index - activeIndex);
  const shouldMountVideo = distance <= 1;
  const isActive = index === activeIndex;

  const handleCtaPress = () => {
    onCtaPress(item.id);
    // Navegación al detalle del producto.
    router.push(`/(tabs)/producto/${item.id}` as any);
  };

  const formatPrice = (price: string) => {
    const num = Number(price);
    if (Number.isNaN(num)) return price;
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <View style={styles.container}>
      {/* Poster de fondo: siempre presente, hace de splash y de fallback. */}
      <Image
        source={{ uri: item.mainImage }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={150}
      />

      {/* Video real: solo en la ventana activa, encima del poster. */}
      {shouldMountVideo && (
        <VideoLayer videoUrl={item.videoUrl} isActive={isActive} isMuted={isMuted} />
      )}

      {/* Tap en el video → toggle mute (UX estándar Reels). */}
      <Pressable style={styles.tapLayer} onPress={onToggleMute} />

      {/* Gradient inferior para legibilidad del texto blanco. */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={styles.bottomGradient}
        pointerEvents="none"
      />

      {/* Indicador de carga mientras el video activo bufferea (solo el activo). */}
      {isActive && (
        <View style={styles.loadingHint} pointerEvents="none">
          <ActivityIndicator size="small" color="rgba(255,255,255,0.6)" />
        </View>
      )}

      {/* Botón mute flotante (derecha-arriba). */}
      <Pressable
        onPress={onToggleMute}
        style={[styles.muteButton, { top: insets.top + 12 }]}
        hitSlop={10}
      >
        <Ionicons
          name={isMuted ? 'volume-mute' : 'volume-high'}
          size={20}
          color="#fff"
        />
      </Pressable>

      {/* Overlay con info del producto */}
      <View style={[styles.infoOverlay, { paddingBottom: insets.bottom + 20 }]}>
        {/* Logo del fabricante (solo si está disponible) */}
        {item.logo ? (
          <View style={styles.logoCircle}>
            <Image source={{ uri: item.logo }} style={styles.logoImg} contentFit="contain" />
          </View>
        ) : null}

        {/* Nombre + precio a la izquierda, CTA a la derecha */}
        <View style={styles.bottomRow}>
          <View style={styles.bottomTextCol}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.price}>{formatPrice(item.price)}</Text>
          </View>

          <Pressable style={styles.cta} onPress={handleCtaPress}>
            <Text style={styles.ctaText}>Ver producto</Text>
            <Ionicons name="arrow-forward" size={14} color="#fff" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
    position: 'relative',
  },
  tapLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
  },
  loadingHint: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
  },
  muteButton: {
    position: 'absolute',
    right: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // — Overlay info —
  infoOverlay: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 0,
    gap: 10,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    overflow: 'hidden',
  },
  logoImg: {
    width: '100%',
    height: '100%',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  bottomTextCol: {
    flex: 1,
    gap: 4,
  },
  productName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 4,
  },
  price: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 4,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#f86f1a',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 22,
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default memo(ReelItem);
