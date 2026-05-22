import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import { FlashList, ViewToken } from '@shopify/flash-list';
import { useDispatch, useSelector } from 'react-redux';
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

// Solo el item visible >= 80% se considera "activo" para autoplay.
const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 80,
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
  const [isMuted, setIsMuted] = useState(true);

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

  const renderItem = useCallback(
    ({ item, index }: { item: VideoFeedItem; index: number }) => (
      <ReelItem
        item={item}
        index={index}
        activeIndex={activeIndex}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onCtaPress={handleCtaPress}
      />
    ),
    [activeIndex, isMuted, toggleMute, handleCtaPress]
  );

  const keyExtractor = useCallback((item: VideoFeedItem) => String(item.id), []);

  // initialScrollIndex defensivo: si el lote ya tiene el item en pos 0, no hace nada.
  const safeInitialIndex = useMemo(
    () => Math.min(Math.max(initialIndex, 0), Math.max(videos.length - 1, 0)),
    [initialIndex, videos.length]
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={videos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={SCREEN_HEIGHT}
        pagingEnabled
        snapToInterval={SCREEN_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        viewabilityConfig={VIEWABILITY_CONFIG}
        onViewableItemsChanged={onViewableItemsChanged}
        initialScrollIndex={safeInitialIndex}
        removeClippedSubviews
        drawDistance={SCREEN_HEIGHT}
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
