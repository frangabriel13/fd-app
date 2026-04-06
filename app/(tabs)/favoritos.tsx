import { useCallback, useEffect } from 'react';
import { Text, View, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { getFavorites, selectFavoriteProducts, selectFavoritesLoading, selectFavoritesError, FavoriteProduct } from '@/store/slices/favoriteSlice';
import { AppDispatch, RootState } from '@/store';
import FavoriteCard from '@/components/favorites/FavoriteCard';
import { useRefresh } from '@/hooks/useRefresh';
import { Colors } from '@/constants/Colors';

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

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.blue.dark} />
        <Text style={styles.loadingText}>Cargando favoritos...</Text>
      </View>
    );
  }

  // Mostrar mensaje si el usuario no es mayorista
  if (userRole !== 'wholesaler') {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="heart-dislike-outline" size={80} color="#ddd" />
        <Text style={styles.emptyText}>Funcionalidad exclusiva para mayoristas</Text>
        <Text style={styles.emptySubtext}>
          Inicia sesión como mayorista para poder guardar y ver tus productos favoritos
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="cloud-offline-outline" size={80} color="#ddd" />
        <Text style={styles.emptyText}>No se pudieron cargar los favoritos</Text>
        <Text style={styles.emptySubtext}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: FavoriteProduct }) => (
    <FavoriteCard product={item} />
  );

  const ListHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Mis Favoritos</Text>
      <Text style={styles.subtitle}>{favoriteProducts.length} {favoriteProducts.length === 1 ? 'producto' : 'productos'}</Text>
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.centerContainer}>
      <Ionicons name="heart-outline" size={80} color="#ddd" />
      <Text style={styles.emptyText}>No tienes productos favoritos</Text>
      <Text style={styles.emptySubtext}>
        Explora productos y guarda tus favoritos para verlos aquí
      </Text>
    </View>
  );

  return (
    <FlatList
      data={favoriteProducts}
      renderItem={renderItem}
      keyExtractor={(item) => item.productId.toString()}
      numColumns={2}
      style={styles.container}
      contentContainerStyle={favoriteProducts.length === 0 ? styles.emptyContentContainer : styles.listContent}
      columnWrapperStyle={styles.columnWrapper}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={favoriteProducts.length > 0 ? ListHeader : null}
      ListEmptyComponent={ListEmpty}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  emptyContentContainer: {
    flex: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
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
    marginHorizontal: -8,
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
});

export default FavsScreen;
