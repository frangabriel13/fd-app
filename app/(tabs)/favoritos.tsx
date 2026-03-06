import { useEffect } from 'react';
import { Text, View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { getFavorites, selectFavoriteProducts, selectFavoritesLoading } from '@/store/slices/favoriteSlice';
import { AppDispatch, RootState } from '@/store';
import FavoriteCard from '@/components/favorites/FavoriteCard';

const FavsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const favoriteProducts = useSelector((state: RootState) => selectFavoriteProducts(state));
  const loading = useSelector((state: RootState) => selectFavoritesLoading(state));

  useEffect(() => {
    dispatch(getFavorites());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#f86f1a" />
        <Text style={styles.loadingText}>Cargando favoritos...</Text>
      </View>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="heart-outline" size={80} color="#ddd" />
        <Text style={styles.emptyText}>No tienes productos favoritos</Text>
        <Text style={styles.emptySubtext}>
          Explora productos y guarda tus favoritos para verlos aquí
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mis Favoritos</Text>
        <Text style={styles.subtitle}>{favoriteProducts.length} {favoriteProducts.length === 1 ? 'producto' : 'productos'}</Text>
      </View>

      {/* Grid de productos */}
      <View style={styles.productsGrid}>
        {favoriteProducts.map((product) => (
          <FavoriteCard key={product.productId} product={product} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 40,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#021344',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
});

export default FavsScreen;