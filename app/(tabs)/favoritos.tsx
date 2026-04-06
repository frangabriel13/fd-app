import { useCallback, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {
  getFavorites,
  selectFavoriteProducts,
  selectFavoritesLoading,
  selectFavoritesError,
  FavoriteProduct,
} from '@/store/slices/favoriteSlice';
import { AppDispatch, RootState } from '@/store';
import FavoriteCard, { FAV_CARD_WIDTH } from '@/components/favorites/FavoriteCard';
import { useRefresh } from '@/hooks/useRefresh';
import { Colors } from '@/constants/Colors';

const CARD_GAP = 3;

// — Skeleton idéntico al de ShopProductGrid —
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
    <Animated.View style={[skeletonStyles.card, animatedStyle]}>
      <View style={skeletonStyles.image} />
      <View style={skeletonStyles.info}>
        <View style={skeletonStyles.line} />
        <View style={skeletonStyles.lineShort} />
        <View style={skeletonStyles.price} />
      </View>
    </Animated.View>
  );
};

const SkeletonGrid = () => (
  <View style={skeletonStyles.grid}>
    {Array.from({ length: 6 }).map((_, i) => (
      <View key={i} style={skeletonStyles.wrapper}>
        <SkeletonCard />
      </View>
    ))}
  </View>
);

// — Separador de filas —
const ItemSeparator = () => <View style={{ height: CARD_GAP }} />;

// — Header de resultados —
const ResultsBar = ({ count }: { count: number }) => (
  <View style={styles.resultsBar}>
    <Text style={styles.resultsText}>
      {count} {count === 1 ? 'producto guardado' : 'productos guardados'}
    </Text>
  </View>
);

// — Estado vacío —
const EmptyState = () => (
  <View style={styles.feedbackContainer}>
    <Ionicons name="heart-outline" size={52} color={Colors.gray.default} />
    <Text style={styles.feedbackTitle}>Sin favoritos</Text>
    <Text style={styles.feedbackText}>
      Explorá productos y guardá tus favoritos para verlos aquí
    </Text>
  </View>
);

const FavsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const favoriteProducts = useSelector((state: RootState) => selectFavoriteProducts(state));
  const loading = useSelector((state: RootState) => selectFavoritesLoading(state));
  const error = useSelector((state: RootState) => selectFavoritesError(state));
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  const { refreshing, onRefresh } = useRefresh(useCallback(() => dispatch(getFavorites()), [dispatch]));

  useEffect(() => {
    if (userRole === 'wholesaler') {
      dispatch(getFavorites());
    }
  }, [dispatch, userRole]);

  // Solo para mayoristas
  if (userRole !== 'wholesaler') {
    return (
      <View style={styles.feedbackContainer}>
        <Ionicons name="heart-dislike-outline" size={52} color={Colors.gray.default} />
        <Text style={styles.feedbackTitle}>Solo para mayoristas</Text>
        <Text style={styles.feedbackText}>
          Iniciá sesión como mayorista para guardar y ver tus productos favoritos
        </Text>
      </View>
    );
  }

  // Skeleton en carga inicial
  if (loading && !refreshing && favoriteProducts.length === 0) {
    return <SkeletonGrid />;
  }

  // Error
  if (error) {
    return (
      <View style={styles.feedbackContainer}>
        <Ionicons name="cloud-offline-outline" size={52} color={Colors.gray.default} />
        <Text style={styles.feedbackTitle}>Ocurrió un error</Text>
        <Text style={styles.feedbackText}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: FavoriteProduct }) => (
    <FavoriteCard product={item} />
  );

  return (
    <FlatList
      data={favoriteProducts}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.productId?.toString() ?? index.toString()}
      numColumns={2}
      style={styles.container}
      contentContainerStyle={favoriteProducts.length === 0 ? styles.emptyContent : undefined}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={<ResultsBar count={favoriteProducts.length} />}
      ListEmptyComponent={EmptyState}
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
  container: {
    flex: 1,
    backgroundColor: Colors.gray.light,
  },
  emptyContent: {
    flex: 1,
  },
  row: {
    gap: CARD_GAP,
    justifyContent: 'flex-start',
  },
  resultsBar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 12,
    color: Colors.gray.semiDark,
  },
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
});

const skeletonStyles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    backgroundColor: Colors.gray.light,
  },
  wrapper: {
    width: FAV_CARD_WIDTH,
  },
  card: {
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  image: {
    width: '100%',
    height: FAV_CARD_WIDTH * 1.3,
    backgroundColor: '#e5e7eb',
  },
  info: {
    padding: 8,
    gap: 6,
  },
  line: {
    height: 10,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  lineShort: {
    height: 10,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    width: '65%',
  },
  price: {
    height: 14,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    width: '45%',
    marginTop: 2,
  },
});

export default FavsScreen;
