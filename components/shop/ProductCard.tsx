import React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_PADDING = 8;
const CARD_GAP = 10;
const NUM_COLUMNS = 2;
export const CARD_WIDTH = (SCREEN_WIDTH - CARD_PADDING * 2 - CARD_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: string;
    priceUSD?: string | null;
    mainImage: string;
    onSale: boolean;
    logo?: string | null;
    category?: {
      id: number;
      name: string;
      parentId?: number;
    };
    gender?: {
      id: number;
      name: string;
    };
    description?: string | null;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
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

  const handleProductPress = () => {
    router.push(`/(tabs)/producto/${product.id}` as any);
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  return (
    <Pressable onPress={handleProductPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.card, animatedStyle]} entering={FadeIn.duration(250)}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.mainImage }}
            style={styles.productImage}
            contentFit="cover"
            transition={200}
          />
          {product.onSale && (
            <View style={styles.saleTag}>
              <Text style={styles.saleTagText}>OFERTA</Text>
            </View>
          )}
          {product.logo && (
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: product.logo }}
                style={styles.logoImage}
                contentFit="contain"
              />
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
            {product.name}
          </Text>
          <Text style={[styles.price, product.onSale && styles.priceOnSale]}>
            {formatPrice(product.price)}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: CARD_WIDTH * 1.3,
    backgroundColor: '#f3f4f6',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  saleTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: Colors.orange.dark,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  saleTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  logoContainer: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  priceOnSale: {
    color: Colors.orange.dark,
  },
});

export default ProductCard;
