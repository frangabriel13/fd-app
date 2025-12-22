import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

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

  const handleProductPress = () => {
    console.log('🛍️ Navegando al producto:', product.id);
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

  const formatPriceUSD = (priceUSD: string | null) => {
    if (!priceUSD) return null;
    const numPrice = parseFloat(priceUSD);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(numPrice);
  };

  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={handleProductPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.mainImage || 'https://via.placeholder.com/140x186' }}
          style={styles.productImage}
          resizeMode="cover"
        />
        {product.logo && (
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: product.logo }}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        )}
        {product.onSale && (
          <View style={styles.saleTag}>
            <Text style={styles.saleTagText}>OFERTA</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
          {product.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: 192,
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
    // marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 240,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
  saleTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.orange.default,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  saleTagText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  productInfo: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    // minHeight: 85,
  },
  productName: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.light.text,
    // marginBottom: 6,
    // lineHeight: 18,
    // minHeight: 36,
  },
  priceContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    // marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.gray.semiDark,
  },
});

export default ProductCard;