import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  FlatList,
  ViewToken,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from 'expo-router';
import {
  fetchFeedNextPage,
  selectFeedVideos,
  selectFeedHasMore,
  selectFeedLoadingMore,
} from '@/store/slices/videoFeedSlice';
import type { AppDispatch } from '@/store';
import type { VideoFeedItem } from '@/types/videoFeed';
import ReelItem from './ReelItem';
import { useReelsAnalytics } from '@/hooks/useReelsAnalytics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Cuando el activeIndex llega a este umbral cerca del final, pedimos la próxima página.
const PREFETCH_THRESHOLD = 3;

// Threshold permisivo. La fuente de verdad principal es onScroll, este
// callback queda como respaldo.
const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 60,
};

interface ReelsFeedListProps {
  initialIndex: number;
}

const ReelsFeedList: React.FC<ReelsFeedListProps> = ({ initialIndex }) => {
  const dispatch = useDispatch<AppDispatch>();
  const videos = useSelector(selectFeedVideos);
  const hasMore = useSelector(selectFeedHasMore);
  const loadingMore = useSelector(selectFeedLoadingMore);
  const analytics = useReelsAnalytics();

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  // Arranca con sonido — el usuario espera escuchar el reel apenas entra.
  // El botón mute (en ReelItem) y el tap en el video siguen permitiendo silenciar.
  const [isMuted, setIsMuted] = useState(false);
  // Foco de la pantalla. Cuando el usuario navega a producto/fabricante, la
  // pantalla de reels queda en background; bajamos este flag para pausar el
  // player y cortar el audio. Vuelve a true al regresar.
  const [isScreenFocused, setIsScreenFocused] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true);
      return () => setIsScreenFocused(false);
    }, [])
  );

  const listRef = useRef<FlatList<VideoFeedItem>>(null);

  // onViewableItemsChanged debe ser estable — FlashList se queja si cambia entre renders.
  const viewedIdsRef = useRef<Set<number>>(new Set());

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length === 0) return;
      const first = viewableItems[0];
      if (first.index == null) return;
      setActiveIndex(first.index);

      const item = first.item as VideoFeedItem | undefined;
      if (item && !viewedIdsRef.current.has(item.id)) {
        viewedIdsRef.current.add(item.id);
        analytics.trackReelViewed(item.id);
      }
    }
  ).current;

  // Dispara prefetch cuando el activeIndex se acerca al final del lote actual.
  React.useEffect(() => {
    if (!hasMore || loadingMore) return;
    if (videos.length === 0) return;
    if (activeIndex >= videos.length - PREFETCH_THRESHOLD) {
      dispatch(fetchFeedNextPage());
    }
  }, [activeIndex, hasMore, loadingMore, videos.length, dispatch]);

  const toggleMute = useCallback(() => setIsMuted((m) => !m), []);

  const handleCtaPress = useCallback(
    (productId: number) => {
      analytics.trackReelCtaClicked(productId);
    },
    [analytics]
  );

  // Detección del índice activo basada en offset (fuente de verdad principal
  // ahora que usamos FlatList). Se calcula también durante el scroll, no
  // sólo al terminar el momentum, para que el cambio se detecte antes.
  const updateActiveFromOffset = useCallback(
    (offsetY: number) => {
      const newIndex = Math.round(offsetY / SCREEN_HEIGHT);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < videos.length) {
        setActiveIndex(newIndex);
      }
    },
    [activeIndex, videos.length]
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      updateActiveFromOffset(e.nativeEvent.contentOffset.y);
    },
    [updateActiveFromOffset]
  );

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      updateActiveFromOffset(e.nativeEvent.contentOffset.y);
    },
    [updateActiveFromOffset]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: VideoFeedItem; index: number }) => (
      <ReelItem
        item={item}
        index={index}
        activeIndex={activeIndex}
        isMuted={isMuted}
        isScreenFocused={isScreenFocused}
        onToggleMute={toggleMute}
        onCtaPress={handleCtaPress}
      />
    ),
    [activeIndex, isMuted, isScreenFocused, toggleMute, handleCtaPress]
  );

  const keyExtractor = useCallback((item: VideoFeedItem) => String(item.id), []);

  // initialScrollIndex defensivo: si el lote ya tiene el item en pos 0, no hace nada.
  const safeInitialIndex = useMemo(
    () => Math.min(Math.max(initialIndex, 0), Math.max(videos.length - 1, 0)),
    [initialIndex, videos.length]
  );

  // getItemLayout permite que initialScrollIndex y scrollToIndex sean
  // instantáneos, sin layout pass intermedio.
  const getItemLayout = useCallback(
    (_data: ArrayLike<VideoFeedItem> | null | undefined, index: number) => ({
      length: SCREEN_HEIGHT,
      offset: SCREEN_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={videos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        pagingEnabled
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        viewabilityConfig={VIEWABILITY_CONFIG}
        onViewableItemsChanged={onViewableItemsChanged}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={32}
        initialScrollIndex={safeInitialIndex}
        getItemLayout={getItemLayout}
        removeClippedSubviews
        windowSize={3}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default ReelsFeedList;
