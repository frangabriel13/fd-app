import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

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
    <Pressable
      style={({ pressed }) => [styles.productCard, pressed && { opacity: 0.7 }]}
      onPress={handleProductPress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={product.mainImage ? { uri: product.mainImage } : require('@/assets/images/react-logo.png')}
          style={styles.productImage}
          contentFit="cover"
          onError={handleImageError}
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
          {product.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  productCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 5,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
  },
  productInfo: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  productName: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.light.text,
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  price: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.gray.semiDark,
  },
});

export default ProductCard;
