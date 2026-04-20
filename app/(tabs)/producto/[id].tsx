import { useEffect, useCallback } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Share } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductWithManufacturer, clearCurrentProduct, setCurrentProductIsFavorite } from '@/store/slices/productSlice';
import { addFavorite, removeFavorite } from '@/store/slices/favoriteSlice';
import { RootState, AppDispatch } from '@/store';
import { formatPrice } from '@/utils/formatPrice';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { shadows } from '@/constants/Styles';
import DetailProduct from '@/components/detailProduct/DetailProduct';
import Gallery from '@/components/detailProduct/Gallery';
import Quantities from '@/components/detailProduct/Quantities';
import ProductSlider from '@/components/home/ProductSlider';

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
    currentProductIsFavorite,
    loading,
    error,
  } = useSelector((state: RootState) => state.product);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  const handleToggleFavorite = useCallback(async () => {
    if (!currentProduct?.id) return;
    if (userRole !== 'wholesaler') {
      Alert.alert(
        'Acceso restringido',
        'Iniciá sesión como mayorista para agregar productos a favoritos',
        [{ text: 'Entendido', style: 'default' }]
      );
      return;
    }
    const productId = parseInt(currentProduct.id);
    try {
      if (currentProductIsFavorite) {
        await dispatch(removeFavorite(productId)).unwrap();
        dispatch(setCurrentProductIsFavorite(false));
      } else {
        await dispatch(addFavorite(productId)).unwrap();
        dispatch(setCurrentProductIsFavorite(true));
      }
    } catch (error: any) {
      console.error('Error al actualizar favoritos:', error);
    }
  }, [currentProduct, currentProductIsFavorite, userRole, dispatch]);

  const handleShare = useCallback(async () => {
    if (!currentProduct) return;
    try {
      await Share.share({ message: `${currentProduct.name} — Fabricante Directo` });
    } catch {}
  }, [currentProduct]);

  useEffect(() => {
    if (id) {
      dispatch(clearCurrentProduct());
      dispatch(fetchProductWithManufacturer(id));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentProduct) {
      console.log('currentProduct:', currentProduct);
    }
  }, [currentProduct]);

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
          isFavorite={currentProductIsFavorite ?? false}
          onToggleFavorite={handleToggleFavorite}
          onShare={handleShare}
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
          categoryId={currentProduct?.categoryId ?? undefined}
        />
      </View>

      {/* Más productos del fabricante */}
      {manufacturerProducts && manufacturerProducts.length > 0 && (
        <View style={styles.sliderCard}>
          <ProductSlider
            title={`Más de ${currentManufacturer?.name || 'este fabricante'}`}
            products={manufacturerProducts.filter(p => p.id !== currentProduct?.id)}
            onMorePress={() => currentManufacturer?.id && router.push(`/(tabs)/store/${currentManufacturer.id}` as any)}
          />
        </View>
      )}

      {/* Productos relacionados */}
      {categoryProducts && categoryProducts.length > 0 && (
        <View style={styles.sliderCard}>
          <ProductSlider
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
    gap: 0,
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
    backgroundColor: Colors.general.error,
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
    color: '#fff',
  },

  // Cards
  galleryCard: {
    backgroundColor: '#fff',
    ...shadows.sm,
  },
  card: {
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 10,
    ...shadows.sm,
  },
  sliderCard: {
    marginTop: 6,
  },

  bottomSpacer: {
    height: 24,
  },
});

export default ProductoScreen;
