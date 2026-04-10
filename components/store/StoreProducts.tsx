import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchStoreProducts } from '@/store/slices/productSlice';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import ProductCard, { CARD_WIDTH } from '@/components/store/ProductCard';
import HeaderProfile from '@/components/store/HeaderProfile';
import Reviews from '@/components/store/Reviews';

const CARD_GAP = 3;

// — Skeleton —
const SkeletonCard = () => {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 550 }),
        withTiming(0.35, { duration: 550 }),
      ),
      -1,
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

const StoreProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedManufacturer } = useSelector((state: RootState) => state.manufacturer);
  const { storeProducts, storePagination, loading, error } = useSelector((state: RootState) => state.product);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (selectedManufacturer?.user?.id) {
      dispatch(fetchStoreProducts({
        userId: selectedManufacturer.user.id.toString(),
        page: 1,
        limit: 16,
        append: false,
      }));
    }
  }, [selectedManufacturer?.user?.id, dispatch]);

  const handleRefresh = async () => {
    if (!selectedManufacturer?.user?.id) return;
    setRefreshing(true);
    await dispatch(fetchStoreProducts({
      userId: selectedManufacturer.user.id.toString(),
      page: 1,
      limit: 16,
      append: false,
    }));
    setRefreshing(false);
  };

  const loadMoreProducts = () => {
    if (loadingMore || loading || !selectedManufacturer?.user?.id) return;
    const currentPage = storePagination?.currentPage || 1;
    const totalPages = storePagination?.totalPages || 1;
    if (currentPage >= totalPages) return;
    setLoadingMore(true);
    dispatch(fetchStoreProducts({
      userId: selectedManufacturer.user.id.toString(),
      page: currentPage + 1,
      limit: 16,
      append: true,
    })).finally(() => setLoadingMore(false));
  };

  const renderProduct = useCallback(
    ({ item }: { item: any }) => <ProductCard product={item} />,
    [],
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

  const renderHeader = () => (
    <View>
      <HeaderProfile />
      <Reviews />
      {storePagination && (
        <View style={styles.resultsBar}>
          <View style={styles.resultsRow}>
            <Text style={styles.resultsCount}>{storePagination.totalProducts}</Text>
            <Text style={styles.resultsLabel}>
              {storePagination.totalProducts === 1 ? 'producto' : 'productos'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  // — Estado error —
  if (error) {
    return (
      <View style={styles.container}>
        <HeaderProfile />
        <Reviews />
        <View style={styles.feedbackContainer}>
          <Ionicons name="cloud-offline-outline" size={52} color={Colors.gray.default} />
          <Text style={styles.feedbackTitle}>Ocurrió un error</Text>
          <Text style={styles.feedbackText}>{error}</Text>
        </View>
      </View>
    );
  }

  // — Estado cargando (primera carga) —
  if (loading && (!storeProducts || storeProducts.length === 0)) {
    return (
      <View style={styles.container}>
        <HeaderProfile />
        <Reviews />
        <SkeletonGrid />
      </View>
    );
  }

  // — Estado vacío —
  if (!loading && (!storeProducts || storeProducts.length === 0)) {
    return (
      <View style={styles.container}>
        <HeaderProfile />
        <Reviews />
        <View style={styles.feedbackContainer}>
          <Ionicons name="bag-outline" size={52} color={Colors.gray.default} />
          <Text style={styles.feedbackTitle}>Sin productos</Text>
          <Text style={styles.feedbackText}>Esta tienda aún no tiene productos publicados</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={storeProducts}
        renderItem={renderProduct}
        keyExtractor={(item, index) => `store-product-${item.id}-${index}`}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productsContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={ItemSeparator}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.blue.dark]}
            tintColor={Colors.blue.dark}
          />
        }
        style={{ flex: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray.light,
  },

  // — Grid —
  row: {
    justifyContent: 'flex-start',
    gap: CARD_GAP,
  },
  separator: {
    height: CARD_GAP,
  },
  productsContainer: {
    paddingVertical: 0,
  },

  // — Barra de resultados —
  resultsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  resultsCount: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.blue.dark,
  },
  resultsLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.gray.semiDark,
  },

  // — Footer paginación —
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: Colors.gray.semiDark,
  },

  // — Estados de feedback —
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
    overflow: 'hidden',
    backgroundColor: Colors.gray.light,
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

export default StoreProducts;
