import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { removeFavorite, getFavorites } from '@/store/slices/favoriteSlice';
import { AppDispatch } from '@/store';

interface FavoriteCardProps {
  product: {
    productId: number;
    name: string;
    mainImage: string;
    price: number;
  };
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ product }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleProductPress = () => {
    router.push(`/(tabs)/producto/${product.productId}` as any);
  };

  const handleRemoveFavorite = async (e: any) => {
    e.stopPropagation(); // Evitar que navegue al producto
    try {
      await dispatch(removeFavorite(product.productId)).unwrap();
      await dispatch(getFavorites());
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleProductPress}
      activeOpacity={0.9}
    >
      {/* Botón de eliminar */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleRemoveFavorite}
        activeOpacity={0.7}
      >
        <Ionicons name="heart" size={22} color="#f86f1a" />
      </TouchableOpacity>

      {/* Imagen del producto */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.mainImage || 'https://via.placeholder.com/160x200' }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>

      {/* Información del producto */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
          {product.name}
        </Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#f5f5f5',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 18,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#021344',
  },
});

export default FavoriteCard;
