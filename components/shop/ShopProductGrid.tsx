import { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import ProductCard from './ProductCard';

interface ShopProductGridProps {
  shopProducts: any[];
  loading: boolean;
  error: string | null;
  loadingMore: boolean;
  onLoadMore: () => void;
}

const ItemSeparator = () => <View style={styles.separator} />;

const ShopProductGrid = ({ shopProducts, loading, error, loadingMore, onLoadMore }: ShopProductGridProps) => {
  const renderProduct = useCallback(
    ({ item }: { item: (typeof shopProducts)[0] }) => <ProductCard product={item} />,
    []
  );

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.blue.default} />
        <Text style={styles.footerText}>Cargando más productos...</Text>
      </View>
    );
  }, [loadingMore]);

  if (loading && shopProducts.length === 0) {
    return (
      <View style={styles.feedbackContainer}>
        <ActivityIndicator size="large" color={Colors.blue.default} />
        <Text style={styles.feedbackText}>Cargando productos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.feedbackContainer}>
        <Ionicons name="cloud-offline-outline" size={48} color={Colors.gray.default} />
        <Text style={styles.feedbackTitle}>Ocurrió un error</Text>
        <Text style={styles.feedbackText}>{error}</Text>
      </View>
    );
  }

  if (!loading && shopProducts.length === 0) {
    return (
      <View style={styles.feedbackContainer}>
        <Ionicons name="search-outline" size={48} color={Colors.gray.default} />
        <Text style={styles.feedbackTitle}>Sin resultados</Text>
        <Text style={styles.feedbackText}>Probá cambiando los filtros o el ordenamiento</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={shopProducts}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.productsContainer}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={ItemSeparator}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  productsContainer: {
    paddingVertical: 8,
  },
  row: {
    justifyContent: 'flex-start',
    gap: 10,
  },
  separator: {
    height: 10,
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 14,
    color: Colors.light.icon,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.light.icon,
    textAlign: 'center',
  },
});

export default ShopProductGrid;
