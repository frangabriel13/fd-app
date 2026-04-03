import { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import ProductCard, { CARD_WIDTH } from './ProductCard';

const CARD_GAP = 3;

interface ShopProductGridProps {
  shopProducts: any[];
  loading: boolean;
  error: string | null;
  loadingMore: boolean;
  refreshing: boolean;
  onLoadMore: () => void;
  onRefresh: () => void;
}

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
      <View style={styles.skeletonInfo}>
        <View style={styles.skeletonLine} />
        <View style={styles.skeletonLineShort} />
        <View style={styles.skeletonPrice} />
      </View>
    </Animated.View>
  );
};

const SkeletonGrid = () => (
  <View style={styles.skeletonGrid}>
    {Array.from({ length: 6 }).map((_, i) => (
      <View key={i} style={styles.skeletonItemWrapper}>
        <SkeletonCard />
      </View>
    ))}
  </View>
);

const ItemSeparator = () => <View style={styles.separator} />;

const ShopProductGrid = ({
  shopProducts,
  loading,
  error,
  loadingMore,
  refreshing,
  onLoadMore,
  onRefresh,
}: ShopProductGridProps) => {
  const renderProduct = useCallback(
    ({ item }: { item: (typeof shopProducts)[0] }) => <ProductCard product={item} />,
    []
  );

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.blue.dark} />
        <Text style={styles.footerText}>Cargando más...</Text>
      </View>
    );
  }, [loadingMore]);

  if (loading && shopProducts.length === 0) {
    return <SkeletonGrid />;
  }

  if (error) {
    return (
      <View style={styles.feedbackContainer}>
        <Ionicons name="cloud-offline-outline" size={52} color={Colors.gray.default} />
        <Text style={styles.feedbackTitle}>Ocurrió un error</Text>
        <Text style={styles.feedbackText}>{error}</Text>
      </View>
    );
  }

  if (!loading && shopProducts.length === 0) {
    return (
      <View style={styles.feedbackContainer}>
        <Ionicons name="search-outline" size={52} color={Colors.gray.default} />
        <Text style={styles.feedbackTitle}>Sin resultados</Text>
        <Text style={styles.feedbackText}>Probá cambiando los filtros o el ordenamiento</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={shopProducts}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.productsContainer}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={ItemSeparator}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.blue.dark]}
          tintColor={Colors.blue.dark}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  productsContainer: {
    paddingVertical: 0,
  },
  row: {
    justifyContent: 'flex-start',
    gap: CARD_GAP,
  },
  separator: {
    height: CARD_GAP,
  },

  // — Feedback states —
  feedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
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
    color: Colors.gray.semiDark,
    textAlign: 'center',
    paddingHorizontal: 32,
  },

  // — Footer —
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: Colors.gray.semiDark,
  },

  // — Skeleton —
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  skeletonItemWrapper: {
    width: CARD_WIDTH,
  },
  skeletonCard: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  skeletonImage: {
    width: '100%',
    height: CARD_WIDTH * 1.3,
    backgroundColor: '#e5e7eb',
  },
  skeletonInfo: {
    padding: 8,
    gap: 6,
  },
  skeletonLine: {
    height: 10,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  skeletonLineShort: {
    height: 10,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    width: '65%',
  },
  skeletonPrice: {
    height: 14,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    width: '45%',
    marginTop: 2,
  },
});

export default ShopProductGrid;
