import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
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
const CARD_GAP = 3;
const NUM_COLUMNS = 2;
export const CARD_WIDTH = (SCREEN_WIDTH - CARD_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

interface StoreProductCardProps {
  product: {
    id: number;
    name: string;
    price: string;
    mainImage: string;
  };
}

const ProductCard: React.FC<StoreProductCardProps> = React.memo(({ product }) => {
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

  const handleImageError = () => {
    console.error('❌ Error al cargar imagen para producto de store:', product.id, product.mainImage);
  };

  return (
    <Pressable onPress={handleProductPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.card, animatedStyle]} entering={FadeIn.duration(250)}>
        <View style={styles.imageContainer}>
          <Image
            source={product.mainImage ? { uri: product.mainImage } : require('@/assets/images/react-logo.png')}
            style={styles.productImage}
            contentFit="cover"
            transition={200}
            onError={handleImageError}
          />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
            {product.name}
          </Text>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 1.3,
    backgroundColor: Colors.gray.light,
    overflow: 'hidden',
  },
  productImage: {
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
});

export default ProductCard;
