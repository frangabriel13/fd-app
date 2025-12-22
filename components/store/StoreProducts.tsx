import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchStoreProducts } from '@/store/slices/productSlice';
import { Colors } from '@/constants/Colors';
import ProductCard from '@/components/store/ProductCard';

const StoreProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedManufacturer } = useSelector((state: RootState) => state.manufacturer);
  const { storeProducts, storePagination, loading, error } = useSelector((state: RootState) => state.product);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (selectedManufacturer?.user?.id) {
      dispatch(fetchStoreProducts({ 
        userId: selectedManufacturer.user.id.toString(),
        page: 1,
        limit: 16,
        append: false
      }));
    }
  }, [selectedManufacturer?.user?.id, dispatch]);

  const loadMoreProducts = () => {
    if (loadingMore || loading || !selectedManufacturer?.user?.id) return;
    
    const currentPage = storePagination?.currentPage || 1;
    const totalPages = storePagination?.totalPages || 1;
    
    if (currentPage >= totalPages) {
      // console.log('📄 No hay más páginas para cargar en la tienda');
      return;
    }
    
    const nextPage = currentPage + 1;
    // console.log('📄 Cargando página:', nextPage, 'para tienda del fabricante:', selectedManufacturer.user.id);
    
    setLoadingMore(true);
    
    dispatch(fetchStoreProducts({ 
      userId: selectedManufacturer.user.id.toString(),
      page: nextPage,
      limit: 16,
      append: true
    })).finally(() => {
      setLoadingMore(false);
    });
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.blue.default} />
        <Text style={styles.footerText}>Cargando más productos...</Text>
      </View>
    );
  };

  const renderProduct = ({ item }: { item: any }) => (
    <ProductCard product={item} />
  );

  const renderLoadingProducts = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.blue.default} />
      <Text style={styles.loadingText}>Cargando productos...</Text>
    </View>
  );

  const renderEmptyProducts = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No hay productos disponibles</Text>
      <Text style={styles.emptySubText}>Esta tienda aún no tiene productos publicados</Text>
    </View>
  );

  const renderProductGrid = () => {
    if (loading && (!storeProducts || storeProducts.length === 0)) {
      return renderLoadingProducts();
    }

    if (!loading && (!storeProducts || storeProducts.length === 0)) {
      return renderEmptyProducts();
    }

    return (
      <FlatList
        data={storeProducts}
        renderItem={renderProduct}
        keyExtractor={(item, index) => `store-product-${item.id}-${index}`}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productsContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        scrollEnabled={false}
        nestedScrollEnabled={true}
      />
    );
  };

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Productos de la tienda</Text>
        {storePagination && (
          <Text style={styles.resultsText}>
            {storePagination.totalProducts} productos
          </Text>
        )}
      </View>
      <View style={styles.productsWrapper}>
        {renderProductGrid()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  productsWrapper: {
    flex: 1,
  },
  productsContainer: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  separator: {
    height: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.icon,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: Colors.light.icon,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
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


export default StoreProducts;