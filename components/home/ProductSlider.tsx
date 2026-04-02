import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { RootState } from '@/store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 16) / 2.35;
const IMAGE_HEIGHT = CARD_WIDTH * 1.35;

interface ProductSliderProps {
  title: string;
  section: 'featured' | 'newProducts' | 'packs' | 'sales' | 'masVendidos' | 'blanqueria' | 'lenceria' | 'calzado' | 'bisuteria' | 'telas' | 'insumos' | 'maquinas';
}

// — Skeleton card —
const SkeletonCard = () => {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 550 }),
        withTiming(0.35, { duration: 550 })
      ),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.skeletonCard, animatedStyle]}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonInfo}>
        <View style={styles.skeletonLine} />
        <View style={styles.skeletonLineShort} />
        <View style={styles.skeletonPrice} />
      </View>
    </Animated.View>
  );
};

// — Product card —
const ProductCard = ({ item, onPress }: { item: any; onPress: () => void }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const discount =
    item.onSale && item.salePrice > 0
      ? Math.round(((item.price - item.salePrice) / item.price) * 100)
      : 0;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.mainImage }}
            style={styles.productImage}
            contentFit="cover"
            transition={200}
          />
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}
          {item.logo && (
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: item.logo }}
                style={styles.logoImage}
                contentFit="contain"
              />
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          {item.onSale && item.salePrice > 0 ? (
            <View style={styles.priceRow}>
              <Text style={styles.salePrice}>{formatPrice(item.salePrice)}</Text>
              <Text style={styles.originalPrice}>{formatPrice(item.price)}</Text>
            </View>
          ) : (
            <Text style={styles.price}>{formatPrice(item.price)}</Text>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
};

// — Componente principal —
const ProductSlider: React.FC<ProductSliderProps> = ({ title, section }) => {
  const { [section]: products, loading } = useSelector((state: RootState) => state.product);
  const router = useRouter();

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
    router.push((queryString ? `/(tabs)/tienda?${queryString}` : '/(tabs)/tienda') as any);
  };

  const isLoading = loading && (!products || products.length === 0);

  if (!isLoading && (!products || products.length === 0)) return null;

  return (
    <View style={styles.container}>
      {/* Header — mismo patrón que Genders y LiveManufacturers */}
      <Pressable style={styles.header} onPress={handleMorePress}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.titleSpacer} />
        <Ionicons name="chevron-forward" size={20} color="#111827" />
      </Pressable>

      {isLoading ? (
        <FlatList
          data={[1, 2, 3]}
          renderItem={() => <SkeletonCard />}
          keyExtractor={(item) => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          scrollEnabled={false}
        />
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onPress={() => router.push(`/(tabs)/producto/${item.id}` as any)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 6,
    paddingBottom: 6,
  },

  // — Header —
  header: {
    paddingHorizontal: 8,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  titleSpacer: {
    flex: 1,
  },

  // — Lista —
  listContent: {
    // paddingHorizontal: 8,
  },

  // — Card —
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: '#f3f4f6',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
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
  logoContainer: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 8,
    gap: 4,
  },
  productName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  salePrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#16a34a',
  },
  originalPrice: {
    fontSize: 11,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },

  // — Skeleton —
  skeletonCard: {
    width: CARD_WIDTH,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  skeletonImage: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: '#e5e7eb',
  },
  skeletonInfo: {
    padding: 8,
    gap: 6,
  },
  skeletonLine: {
    height: 10,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  skeletonLineShort: {
    height: 10,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    width: '65%',
  },
  skeletonPrice: {
    height: 14,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    width: '45%',
    marginTop: 2,
  },
});

export default ProductSlider;
