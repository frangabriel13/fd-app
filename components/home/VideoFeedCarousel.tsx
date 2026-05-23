import React, { useEffect, memo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {
  selectCarouselVideos,
  selectCarouselLoading,
  selectCarouselError,
} from '@/store/slices/videoFeedSlice';
import type { VideoFeedItem } from '@/types/videoFeed';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Cards más altas que anchas para evocar el formato vertical de los videos.
const CARD_WIDTH = (SCREEN_WIDTH - 16) / 2.35;
const CARD_HEIGHT = CARD_WIDTH * 1.6;

// — Skeleton card —
const SkeletonCard = () => {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 550 }),
        withTiming(0.35, { duration: 550 })
      ),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.skeletonCard, animatedStyle]}>
      <View style={styles.skeletonImage} />
    </Animated.View>
  );
};

// — Card de video —
const VideoCard = memo(function VideoCard({
  item,
  onPress,
}: {
  item: VideoFeedItem;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Image
          source={{ uri: item.mainImage }}
          style={styles.poster}
          contentFit="cover"
          transition={200}
        />

        {/* Gradient inferior + overlay con info */}
        <View style={styles.bottomShade} pointerEvents="none" />

        {/* Logo del fabricante */}
        {item.logo && (
          <View style={styles.logoContainer}>
            <Image source={{ uri: item.logo }} style={styles.logoImage} contentFit="contain" />
          </View>
        )}

        {/* Play icon centrado */}
        <View style={styles.playIconWrapper} pointerEvents="none">
          <View style={styles.playIconBg}>
            <Ionicons name="play" size={22} color="#fff" />
          </View>
        </View>

        {/* Nombre del producto */}
        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
          {item.name}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

// — Componente principal —
const VideoFeedCarousel: React.FC = () => {
  const router = useRouter();
  const videos = useSelector(selectCarouselVideos);
  const loading = useSelector(selectCarouselLoading);
  const error = useSelector(selectCarouselError);

  const isLoading = loading && videos.length === 0;

  // Empty state silencioso: si no hay videos (o hubo error), no renderizamos nada
  // para no romper el layout del Home.
  if (!isLoading && (videos.length === 0 || error)) return null;

  const openReels = (productId: number) => {
    router.push({ pathname: '/reels', params: { startWith: String(productId) } } as any);
  };

  return (
    <View style={styles.container}>
      {/* Header (tappeable: navega a la pantalla con grilla paginada) */}
      <Pressable
        style={styles.header}
        onPress={() => router.push('/videos-destacados' as any)}
      >
        <Ionicons name="videocam" size={18} color="#021344" />
        <Text style={styles.title}>Videos Destacados</Text>
        <View style={styles.headerSpacer} />
        <Ionicons name="chevron-forward" size={20} color="#111827" />
      </Pressable>

      {isLoading ? (
        <FlatList
          data={[1, 2, 3]}
          renderItem={() => <SkeletonCard />}
          keyExtractor={(item) => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          scrollEnabled={false}
        />
      ) : (
        <FlatList
          data={videos}
          renderItem={({ item }) => <VideoCard item={item} onPress={() => openReels(item.id)} />}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 6,
    paddingBottom: 6,
  },

  // — Header —
  header: {
    paddingHorizontal: 8,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  headerSpacer: {
    flex: 1,
  },

  // — Lista —
  listContent: {
    paddingHorizontal: 6,
  },

  // — Card —
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  bottomShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  logoContainer: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  playIconWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 3,
  },
  productName: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 15,
  },

  // — Skeleton —
  skeletonCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  skeletonImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
  },
});

export default VideoFeedCarousel;
