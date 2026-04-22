import { useCallback, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
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
import FavoriteCard from '@/components/favorites/FavoriteCard';
import { useRefresh } from '@/hooks/useRefresh';
import { Colors } from '@/constants/Colors';
import { shadows, spacing } from '@/constants/Styles';

// ── Skeleton ─────────────────────────────────────────────────────────────────
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
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[skeletonStyles.card, animatedStyle]}>
      <View style={skeletonStyles.image} />
      <View style={skeletonStyles.info}>
        <View style={skeletonStyles.lineLong} />
        <View style={skeletonStyles.lineShort} />
        <View style={skeletonStyles.linePrice} />
        <View style={skeletonStyles.footer}>
          <View style={skeletonStyles.btnSkeleton} />
        </View>
      </View>
    </Animated.View>
  );
};

const SkeletonList = () => (
  <View style={skeletonStyles.list}>
    {Array.from({ length: 5 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </View>
);

// ── Estado vacío ─────────────────────────────────────────────────────────────
const EmptyState = () => (
  <View style={styles.feedbackContainer}>
    <View style={styles.feedbackIconWrap}>
      <Ionicons name="heart-outline" size={44} color={Colors.blue.dark} />
    </View>
    <Text style={styles.feedbackTitle}>Sin favoritos aún</Text>
    <Text style={styles.feedbackText}>
      Explorá productos y guardá tus favoritos para encontrarlos fácil
    </Text>
    <Animated.View>
      <Text
        style={styles.goShopLink}
        onPress={() => router.push('/(tabs)/tienda')}
      >
        Ir a la tienda →
      </Text>
    </Animated.View>
  </View>
);

// ── Pantalla principal ────────────────────────────────────────────────────────
const FavsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const favoriteProducts = useSelector((state: RootState) => selectFavoriteProducts(state));
  const loading = useSelector((state: RootState) => selectFavoritesLoading(state));
  const error = useSelector((state: RootState) => selectFavoritesError(state));
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  const { refreshing, onRefresh } = useRefresh(
    useCallback(() => dispatch(getFavorites()), [dispatch])
  );

  useFocusEffect(
    useCallback(() => {
      if (userRole === 'wholesaler') {
        dispatch(getFavorites());
      }
    }, [dispatch, userRole])
  );

  // Solo para mayoristas
  if (userRole !== 'wholesaler') {
    return (
      <View style={styles.feedbackContainer}>
        <View style={styles.feedbackIconWrap}>
          <Ionicons name="heart-dislike-outline" size={44} color={Colors.blue.dark} />
        </View>
        <Text style={styles.feedbackTitle}>Solo para mayoristas</Text>
        <Text style={styles.feedbackText}>
          Iniciá sesión como mayorista para guardar y ver tus productos favoritos
        </Text>
      </View>
    );
  }

  // Skeleton en carga inicial
  if (loading && !refreshing && favoriteProducts.length === 0) {
    return (
      <View style={styles.container}>
        <Header count={0} loading />
        <SkeletonList />
      </View>
    );
  }

  // Error
  if (error) {
    return (
      <View style={styles.feedbackContainer}>
        <View style={styles.feedbackIconWrap}>
          <Ionicons name="cloud-offline-outline" size={44} color={Colors.blue.dark} />
        </View>
        <Text style={styles.feedbackTitle}>Ocurrió un error</Text>
        <Text style={styles.feedbackText}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: FavoriteProduct; index: number }) => (
    <FavoriteCard product={item} index={index} />
  );

  return (
    <View style={styles.container}>
      <Header count={favoriteProducts.length} />
      <FlatList
        data={favoriteProducts}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.productId?.toString() ?? index.toString()}
        contentContainerStyle={[
          styles.listContent,
          favoriteProducts.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    </View>
  );
};

// ── Header ────────────────────────────────────────────────────────────────────
const Header = ({ count, loading = false }: { count: number; loading?: boolean }) => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      <Text style={styles.headerTitle}>Mis favoritos</Text>
      {!loading && count > 0 && (
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>
            {count} {count === 1 ? 'producto' : 'productos'}
          </Text>
        </View>
      )}
    </View>
  </View>
);

// ── Estilos ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray.light,
  },

  // ── Header ──────────────────────────
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.blue.dark,
  },
  headerBadge: {
    backgroundColor: Colors.blue.dark + '12',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.blue.dark,
  },

  // ── Lista ────────────────────────────
  listContent: {
    paddingTop: 6,
    paddingBottom: spacing.lg,
  },
  listContentEmpty: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },

  // ── Estados vacío / error ────────────
  feedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
    gap: 12,
    backgroundColor: Colors.gray.light,
  },
  feedbackIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.blue.dark + '0F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 14,
    color: Colors.gray.semiDark,
    textAlign: 'center',
    lineHeight: 20,
  },
  goShopLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.orange.dark,
    marginTop: 4,
  },
});

// ── Skeleton styles ───────────────────────────────────────────────────────────
const skeletonStyles = StyleSheet.create({
  list: {
    padding: 12,
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    height: 100,
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: '#e5e7eb',
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  lineLong: {
    height: 10,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    width: '80%',
  },
  lineShort: {
    height: 10,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    width: '55%',
    marginTop: 4,
  },
  linePrice: {
    height: 14,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    width: '40%',
    marginTop: 6,
  },
  footer: {
    alignItems: 'flex-end',
  },
  btnSkeleton: {
    height: 24,
    width: 72,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
});

export default FavsScreen;
