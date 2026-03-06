import { useEffect } from 'react';
import { Text, View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getFavorites, selectFavoriteProducts, selectFavoritesLoading } from '@/store/slices/favoriteSlice';
import { AppDispatch, RootState } from '@/store';

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
        <Text style={styles.emptyText}>No tienes productos favoritos</Text>
        <Text style={styles.emptySubtext}>
          Agrega productos a favoritos desde la pantalla de detalles
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tus Favoritos ({favoriteProducts.length})</Text>
      {/* Aquí puedes agregar componentes para mostrar los productos favoritos */}
      {favoriteProducts.map((product) => (
        <View key={product.productId} style={styles.productCard}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  productCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
  },
});

export default FavsScreen;