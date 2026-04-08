import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductWithManufacturer, clearCurrentProduct } from '@/store/slices/productSlice';
import { RootState, AppDispatch } from '@/store';
import { formatPrice } from '@/utils/formatPrice';
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
    currentProductViews,
    loading,
    error
  } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    if (id) {
      dispatch(clearCurrentProduct());
      dispatch(fetchProductWithManufacturer(id));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [id, dispatch]);

  if (loading) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.loadingText}>Cargando producto...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.errorText}>No se pudo cargar el producto</Text>
        <Pressable
          style={styles.retryBtn}
          onPress={() => id && dispatch(fetchProductWithManufacturer(id))}
        >
          <Text style={styles.retryBtnText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.productContainer}>
        <Text className="text-white text-center py-1 font-mont-bold text-base">Compra mínima de {formatPrice(currentManufacturer?.minPurchase ?? 0)} en {currentManufacturer?.name}</Text>
      </View>
      <View style={styles.detailContainer}>  
        <Gallery images={currentProduct?.images} mainImage={currentProduct?.mainImage} />
        <DetailProduct
          product={currentProduct || undefined}
          manufacturer={currentManufacturer || undefined}
          views={currentProductViews ?? undefined}
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
  centeredState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 15,
    color: '#ef4444',
    textAlign: 'center',
  },
  retryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#021344',
  },
  retryBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  productContainer: {
    backgroundColor: '#b91c1c',
  },
  detailContainer: {
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
});


export default ProductoScreen;