import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import type { RootState } from '@/store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 32) / 2.4; // Show ~2.4 cards so the next one peeks
const IMAGE_HEIGHT = CARD_WIDTH * 1.3;

interface ProductSliderProps {
  title: string;
  section: 'featured' | 'newProducts' | 'packs' | 'sales' | 'blanqueria' | 'lenceria' | 'calzado' | 'bisuteria' | 'telas' | 'insumos' | 'maquinas';
}

const ProductSlider: React.FC<ProductSliderProps> = ({ title, section }) => {
  const { [section]: products, loading, error } = useSelector((state: RootState) => state.product);
  const router = useRouter();

  const handleProductPress = (product: any) => {
    router.push(`/(tabs)/producto/${product.id}` as any);
  };

  const handleMorePress = () => {
    const redirectConfig: Record<string, { genderId?: number; categoryId?: number; sortBy?: string }> = {
      featured: {},
      newProducts: { sortBy: 'newest' },
      packs: { genderId: 7, categoryId: 161 },
      sales: { sortBy: 'onSale' },
      blanqueria: { genderId: 7, categoryId: 130 },
      lenceria: { genderId: 3, categoryId: 153 },
      calzado: { genderId: 2, categoryId: 154 },
      bisuteria: { genderId: 7, categoryId: 131 },
      telas: { genderId: 7, categoryId: 162 },
      insumos: { genderId: 7, categoryId: 163 },
      maquinas: { genderId: 7, categoryId: 164 },
    };

    const config = redirectConfig[section] || {};
    const params = new URLSearchParams();
    if (config.genderId) params.append('genderId', config.genderId.toString());
    if (config.categoryId) params.append('categoryId', config.categoryId.toString());
    if (config.sortBy) params.append('sortBy', config.sortBy);

    const queryString = params.toString();
    const route = queryString ? `/(tabs)/tienda?${queryString}` : '/(tabs)/tienda';
    router.push(route as any);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDiscountPercent = (price: number, salePrice: number) => {
    if (!price || !salePrice || salePrice >= price) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  };

  const renderProduct = ({ item }: { item: any }) => {
    const discount = item.onSale && item.salePrice > 0
      ? getDiscountPercent(item.price, item.salePrice)
      : 0;

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => handleProductPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.mainImage || 'https://via.placeholder.com/140x186' }}
            style={styles.productImage}
            resizeMode="cover"
          />
          {item.logo && (
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: item.logo }}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          )}
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
            {item.name}
          </Text>
          <View style={styles.priceContainer}>
            {item.onSale && item.salePrice > 0 ? (
              <>
                <Text style={styles.salePrice}>{formatPrice(item.salePrice)}</Text>
                <Text style={styles.originalPrice}>{formatPrice(item.price)}</Text>
              </>
            ) : (
              <Text style={styles.price}>{formatPrice(item.price)}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && products.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={handleMorePress} activeOpacity={0.6} style={styles.seeMoreBtn}>
            <Text style={styles.seeMoreText}>Ver más</Text>
            <AntDesign name="right" size={14} color="#f86f1a" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error al cargar productos</Text>
        </View>
      </View>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={handleMorePress} activeOpacity={0.6} style={styles.seeMoreBtn}>
          <Text style={styles.seeMoreText}>Ver más</Text>
          <AntDesign name="right" size={14} color="#f86f1a" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={{ width: 4 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#021344',
    letterSpacing: -0.3,
  },
  seeMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeMoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f86f1a',
  },
  listContainer: {
    paddingHorizontal: 12,
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: '#f8f8f8',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },
  productInfo: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  productName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4b5563',
    lineHeight: 16,
    marginBottom: 4,
    minHeight: 32,
  },
  priceContainer: {
    flexDirection: 'column',
    gap: 0,
  },
  price: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  salePrice: {
    fontSize: 17,
    fontWeight: '700',
    color: '#16a34a',
  },
  originalPrice: {
    fontSize: 11,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  errorContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 13,
    color: '#ef4444',
  },
});

export default ProductSlider;
