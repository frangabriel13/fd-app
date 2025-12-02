import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductWithManufacturer } from '@/store/slices/productSlice';
import { RootState, AppDispatch } from '@/store';

const ProductoScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { 
    currentProduct, 
    currentManufacturer, 
    manufacturerProducts, 
    categoryProducts, 
    loading, 
    error 
  } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    if(id) {
      // console.log('🛍️ Cargando producto con ID:', id);
      dispatch(fetchProductWithManufacturer(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentProduct) {
      console.log('✅ Datos del producto cargados:', currentProduct);
      console.log('🏭 Datos del fabricante:', currentManufacturer);
      console.log('📦 Productos del fabricante:', manufacturerProducts);
      console.log('🏷️ Productos de la categoría:', categoryProducts);
    }
  }, [currentProduct, currentManufacturer, manufacturerProducts, categoryProducts]);

  useEffect(() => {
    if (error) {
      console.log('❌ Error al cargar producto:', error);
    }
  }, [error]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando producto...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.productContainer}>
        <Text className="text-white text-center py-1 font-mont-bold text-base">Compra mínima de ${currentManufacturer?.minPurchase} en {currentManufacturer?.name}</Text>
      </View>
      <View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },

  productContainer: {
    backgroundColor: '#b91c1c',
  },
});


export default ProductoScreen;