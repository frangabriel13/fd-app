import React, { memo, useEffect, useRef, useState } from 'react';
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
  onEnded: () => void;
}

// Sub-componente que monta el player real. Solo se renderiza cuando el slide
// está dentro de la "ventana" cercana al activeIndex; fuera de eso queda como
// poster estático para liberar memoria/decoders.
const VideoLayer = memo(function VideoLayer({
  videoUrl,
  isActive,
  isMuted,
  isPausedManually,
  onEnded,
}: {
  videoUrl: string;
  isActive: boolean;
  isMuted: boolean;
  isPausedManually: boolean;
  onEnded: () => void;
}) {
  const player = useVideoPlayer(videoUrl, (p) => {
    // loop = false → necesario para que expo-video emita 'playToEnd' y podamos
    // hacer auto-advance al siguiente reel.
    p.loop = false;
    p.muted = isMuted;
    p.volume = isMuted ? 0 : 1;
  });

  // Detecta el flanco "inactive → active" para resetear a 0 sin pisar el
  // currentTime cuando el usuario solo está reanudando una pausa manual.
  const prevActiveRef = useRef(isActive);
  useEffect(() => {
    if (isActive && !prevActiveRef.current) {
      try {
        player.currentTime = 0;
      } catch {
        // expo-video puede tirar si el player aún no cargó; lo ignoramos.
      }
    }
    prevActiveRef.current = isActive;
  }, [isActive, player]);

  // Play / pause combinando "es el reel visible" + "el usuario lo pausó".
  useEffect(() => {
    const shouldPlay = isActive && !isPausedManually;
    if (shouldPlay) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, isPausedManually, player]);

  // Mute robusto: además de la flag, llevamos el volumen a 0. En algunas
  // versiones de expo-video la prop `muted` no se respeta dinámicamente.
  useEffect(() => {
    player.muted = isMuted;
    player.volume = isMuted ? 0 : 1;
  }, [isMuted, player]);

  // Listener de fin de video: dispara onEnded para que el feed avance solo.
  useEffect(() => {
    const sub = player.addListener('playToEnd', () => {
      onEnded();
    });
    return () => sub.remove();
  }, [player, onEnded]);

  return (
    <VideoView
      player={player}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      nativeControls={false}
      allowsPictureInPicture={false}
      pointerEvents="none"
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
  onEnded,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Ventana de carga: el video activo y sus vecinos inmediatos mantienen player.
  // Más lejos: solo poster estático.
  const distance = Math.abs(index - activeIndex);
  const shouldMountVideo = distance <= 1;
  const isActive = index === activeIndex;

  // Pausa manual local del reel. Se resetea cuando el reel deja de ser activo
  // (al volver, debe arrancar reproduciéndose siempre).
  const [isPausedManually, setIsPausedManually] = useState(false);
  useEffect(() => {
    if (!isActive && isPausedManually) {
      setIsPausedManually(false);
    }
  }, [isActive, isPausedManually]);

  const handleTogglePause = () => {
    if (isActive) setIsPausedManually((p) => !p);
  };

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
        <VideoLayer
          videoUrl={item.videoUrl}
          isActive={isActive}
          isMuted={isMuted}
          isPausedManually={isPausedManually}
          onEnded={onEnded}
        />
      )}

      {/* Tap en el video → pausa/resume. El mute se maneja con el botón
          flotante de arriba a la derecha. */}
      <Pressable style={styles.tapLayer} onPress={handleTogglePause} />

      {/* Gradient inferior para legibilidad del texto blanco. */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={styles.bottomGradient}
        pointerEvents="none"
      />

      {/* Indicador de carga mientras el video activo bufferea (solo el activo). */}
      {isActive && !isPausedManually && (
        <View style={styles.loadingHint} pointerEvents="none">
          <ActivityIndicator size="small" color="rgba(255,255,255,0.6)" />
        </View>
      )}

      {/* Indicador visual de pausa manual (ícono de play grande al centro). */}
      {isActive && isPausedManually && (
        <View style={styles.pauseIndicator} pointerEvents="none">
          <Ionicons name="play" size={56} color="rgba(255,255,255,0.85)" />
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
        {/* Logo del fabricante (solo si está disponible). Clickeable: navega
            a la tienda del fabricante si el backend mandó el manufacturerId. */}
        {item.logo ? (
          <Pressable
            onPress={() => {
              if (item.manufacturerId) {
                router.push(`/(tabs)/store/${item.manufacturerId}` as any);
              }
            }}
            style={styles.logoCircle}
            hitSlop={8}
          >
            <Image source={{ uri: item.logo }} style={styles.logoImg} contentFit="contain" />
          </Pressable>
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
  pauseIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
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
