import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchGridFirstPage,
  fetchGridNextPage,
  resetGrid,
  selectGridError,
  selectGridHasMore,
  selectGridLoading,
  selectGridLoadingMore,
  selectGridVideos,
} from '@/store/slices/videoFeedSlice';
import type { VideoFeedItem } from '@/types/videoFeed';
import BackHeader from '@/components/headers/BackHeader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 3;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.6;

// — Card de video (misma estética que el carrusel del Home) —
const VideoGridCard = memo(function VideoGridCard({
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

        <View style={styles.bottomShade} pointerEvents="none" />

        {item.logo && (
          <View style={styles.logoContainer}>
            <Image source={{ uri: item.logo }} style={styles.logoImage} contentFit="contain" />
          </View>
        )}

        <View style={styles.playIconWrapper} pointerEvents="none">
          <View style={styles.playIconBg}>
            <Ionicons name="play" size={22} color="#fff" />
          </View>
        </View>

        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
          {item.name}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

// — Skeleton card pulsante —
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

  return <Animated.View style={[styles.skeletonCard, animatedStyle]} />;
};

const SkeletonGrid = () => (
  <View style={styles.skeletonGrid}>
    {Array.from({ length: 6 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </View>
);

const ItemSeparator = () => <View style={{ height: CARD_GAP }} />;

const VideosDestacadosScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const videos = useAppSelector(selectGridVideos);
  const loading = useAppSelector(selectGridLoading);
  const loadingMore = useAppSelector(selectGridLoadingMore);
  const hasMore = useAppSelector(selectGridHasMore);
  const error = useAppSelector(selectGridError);

  const [refreshing, setRefreshing] = useState(false);

  // Carga inicial solo si no hay datos (preserva scroll al volver de reels).
  useEffect(() => {
    if (videos.length === 0 && !loading) {
      dispatch(fetchGridFirstPage());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(resetGrid());
    try {
      await dispatch(fetchGridFirstPage()).unwrap();
    } catch {
      // El error ya quedó en gridError; el estado de UI lo muestra.
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      dispatch(fetchGridNextPage());
    }
  }, [dispatch, loadingMore, hasMore, loading]);

  const handleRetry = useCallback(() => {
    dispatch(fetchGridFirstPage());
  }, [dispatch]);

  const openReels = useCallback(
    (videoId: number) => {
      router.push({ pathname: '/reels', params: { startWith: String(videoId) } } as any);
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }: { item: VideoFeedItem }) => (
      <VideoGridCard item={item} onPress={() => openReels(item.id)} />
    ),
    [openReels]
  );

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#021344" />
        <Text style={styles.footerText}>Cargando más...</Text>
      </View>
    );
  }, [loadingMore]);

  const isInitialLoading = loading && videos.length === 0;
  const showError = !!error && videos.length === 0;
  const isEmpty = !loading && !error && videos.length === 0;

  return (
    <View style={styles.root}>
      <BackHeader />
      <View style={styles.titleBar}>
        <Ionicons name="videocam" size={18} color="#021344" />
        <Text style={styles.title}>Videos Destacados</Text>
      </View>

      {isInitialLoading ? (
        <SkeletonGrid />
      ) : showError ? (
        <View style={styles.feedbackContainer}>
          <Ionicons name="cloud-offline-outline" size={52} color="#9ca3af" />
          <Text style={styles.feedbackTitle}>Ocurrió un error</Text>
          <Text style={styles.feedbackText}>{error}</Text>
          <Pressable style={styles.retryBtn} onPress={handleRetry}>
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : isEmpty ? (
        <View style={styles.feedbackContainer}>
          <Ionicons name="videocam-off-outline" size={52} color="#9ca3af" />
          <Text style={styles.feedbackTitle}>Sin videos por ahora</Text>
          <Text style={styles.feedbackText}>Volvé en un rato — siempre se están subiendo nuevos.</Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          ItemSeparatorComponent={ItemSeparator}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#021344']}
              tintColor="#021344"
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // — Title bar (debajo del BackHeader) —
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // — FlatList layout —
  row: {
    justifyContent: 'flex-start',
    gap: CARD_GAP,
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

  // — Footer loader —
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
  },

  // — Feedback states (error/empty) —
  feedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
    gap: 12,
  },
  feedbackTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 8,
    backgroundColor: '#f86f1a',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
  },

  // — Skeleton grid (loading inicial) —
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    padding: 0,
  },
  skeletonCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
});

export default VideosDestacadosScreen;
