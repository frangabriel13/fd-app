import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductWithManufacturer } from '@/store/slices/productSlice';
import { RootState, AppDispatch } from '@/store';
import DetailProduct from '@/components/detailProduct/DetailProduct';
import Gallery from '@/components/detailProduct/Gallery';
import Quantities from '@/components/detailProduct/Quantities';
import RelatedProductSlider from '@/components/detailProduct/RelatedProductSlider';

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
      // console.log('📦 Productos del fabricante:', manufacturerProducts);
      // console.log('🏷️ Productos de la categoría:', categoryProducts);
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
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.productContainer}>
        <Text className="text-white text-center py-1 font-mont-bold text-base">Compra mínima de ${currentManufacturer?.minPurchase} en {currentManufacturer?.name}</Text>
      </View>
      <View style={styles.detailContainer}>  
        <Gallery images={currentProduct?.images} mainImage={currentProduct?.mainImage} />
        <DetailProduct
          product={currentProduct || undefined}
          manufacturer={currentManufacturer || undefined}
        />
        <Quantities 
          isVariable={currentProduct?.isVariable} 
          inventories={currentProduct?.inventories}
          manufacturerId={currentManufacturer?.id || 0}
          productId={currentProduct?.id?.toString() || ''}
        />
        
        {/* Productos del mismo fabricante */}
        {manufacturerProducts && manufacturerProducts.length > 0 && (
          <RelatedProductSlider
            title={`Más de ${currentManufacturer?.name || 'este fabricante'}`}
            products={manufacturerProducts.filter(p => p.id !== currentProduct?.id)}
            onMorePress={() => console.log('Ver más productos del fabricante')}
          />
        )}
        
        {/* Productos relacionados */}
        {categoryProducts && categoryProducts.length > 0 && (
          <RelatedProductSlider
            title="Productos relacionados"
            products={categoryProducts.filter(p => p.id !== currentProduct?.id)}
            onMorePress={() => console.log('Ver más productos relacionados')}
          />
        )}
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },

  productContainer: {
    backgroundColor: '#b91c1c',
  },

  detailContainer: {
    // paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
});


export default ProductoScreen;