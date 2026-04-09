import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductWithManufacturer, clearCurrentProduct } from '@/store/slices/productSlice';
import { RootState, AppDispatch } from '@/store';
import { formatPrice } from '@/utils/formatPrice';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { shadows } from '@/constants/Styles';
import DetailProduct from '@/components/detailProduct/DetailProduct';
import Gallery from '@/components/detailProduct/Gallery';
import Quantities from '@/components/detailProduct/Quantities';
import RelatedProductSlider from '@/components/detailProduct/RelatedProductSlider';

const LoadingState = () => (
  <View style={styles.centeredState}>
    <View style={styles.loadingIndicator} />
    <Text style={styles.loadingText}>Cargando producto...</Text>
  </View>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <View style={styles.centeredState}>
    <Ionicons name="alert-circle-outline" size={52} color="#ef4444" />
    <Text style={styles.errorText}>No se pudo cargar el producto</Text>
    <Pressable
      style={({ pressed }) => [styles.retryBtn, pressed && styles.retryBtnPressed]}
      onPress={onRetry}
    >
      <Text style={styles.retryBtnText}>Reintentar</Text>
    </Pressable>
  </View>
);

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
    error,
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

  if (loading) return <LoadingState />;
  if (error) return <ErrorState onRetry={() => id && dispatch(fetchProductWithManufacturer(id))} />;

  return (
    <ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Banner compra mínima */}
      <View style={styles.minPurchaseBanner}>
        <Ionicons name="bag-handle-outline" size={14} color="rgba(255,255,255,0.8)" />
        <Text style={styles.minPurchaseText}>
          Compra mínima{' '}
          <Text style={styles.minPurchaseAmount}>
            {formatPrice(currentManufacturer?.minPurchase ?? 0)}
          </Text>
          {' '}en {currentManufacturer?.name}
        </Text>
      </View>

      {/* Galería */}
      <View style={styles.galleryCard}>
        <Gallery
          images={currentProduct?.images}
          mainImage={currentProduct?.mainImage}
        />
      </View>

      {/* Información del producto */}
      <View style={styles.card}>
        <DetailProduct
          product={currentProduct || undefined}
          manufacturer={currentManufacturer || undefined}
          views={currentProductViews ?? undefined}
        />
      </View>

      {/* Selector de cantidades */}
      <View style={styles.card}>
        <Quantities
          isVariable={currentProduct?.isVariable}
          inventories={currentProduct?.inventories}
          manufacturerId={currentManufacturer?.id || 0}
          productId={currentProduct?.id?.toString() || ''}
        />
      </View>

      {/* Más productos del fabricante */}
      {manufacturerProducts && manufacturerProducts.length > 0 && (
        <View style={[styles.card, styles.sliderCard]}>
          <RelatedProductSlider
            title={`Más de ${currentManufacturer?.name || 'este fabricante'}`}
            products={manufacturerProducts.filter(p => p.id !== currentProduct?.id)}
          />
        </View>
      )}

      {/* Productos relacionados */}
      {categoryProducts && categoryProducts.length > 0 && (
        <View style={[styles.card, styles.sliderCard]}>
          <RelatedProductSlider
            title="Productos relacionados"
            products={categoryProducts.filter(p => p.id !== currentProduct?.id)}
          />
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.gray.light,
  },
  scrollContent: {
    gap: 6,
  },

  // Estados
  centeredState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
    minHeight: 500,
    backgroundColor: Colors.gray.light,
  },
  loadingIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.blue.dark + '18',
  },
  loadingText: {
    fontSize: 15,
    color: Colors.gray.semiDark,
  },
  errorText: {
    fontSize: 15,
    color: '#ef4444',
    textAlign: 'center',
  },
  retryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    backgroundColor: Colors.blue.dark,
  },
  retryBtnPressed: {
    opacity: 0.85,
  },
  retryBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Banner compra mínima
  minPurchaseBanner: {
    backgroundColor: Colors.blue.dark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  minPurchaseText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
  },
  minPurchaseAmount: {
    fontWeight: '700',
    color: Colors.orange.dark,
  },

  // Cards
  galleryCard: {
    backgroundColor: '#fff',
    ...shadows.sm,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    ...shadows.sm,
  },
  sliderCard: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  bottomSpacer: {
    height: 24,
  },
});

export default ProductoScreen;
