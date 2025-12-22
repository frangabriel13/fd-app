import { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchStoreProducts } from '@/store/slices/productSlice';

const StoreProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedManufacturer } = useSelector((state: RootState) => state.manufacturer);
  const { storeProducts, loading, error } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    if (selectedManufacturer?.user?.id) {
      dispatch(fetchStoreProducts({ 
        userId: selectedManufacturer.user.id.toString(),
        page: 1,
        limit: 10 
      }));
    }
  }, [selectedManufacturer?.user?.id, dispatch]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando productos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos de la tienda</Text>
      {storeProducts.length > 0 ? (
        <FlatList
          data={storeProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centered}>
          <Text>No hay productos disponibles</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    flex: 1,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default StoreProducts;