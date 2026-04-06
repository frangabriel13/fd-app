import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { removeFavorite, selectRemovingProductId } from '@/store/slices/favoriteSlice';
import { AppDispatch, RootState } from '@/store';

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
  const removingProductId = useSelector((state: RootState) => selectRemovingProductId(state));
  const [imageError, setImageError] = useState(false);

  const isRemoving = removingProductId === product.productId;

  const handleProductPress = () => {
    router.push(`/(tabs)/producto/${product.productId}` as any);
  };

  const handleRemoveFavorite = async () => {
    try {
      await dispatch(removeFavorite(product.productId)).unwrap();
    } catch (error: any) {
      Alert.alert('Error', error || 'No se pudo eliminar el favorito. Intentá de nuevo.');
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
        disabled={isRemoving}
      >
        {isRemoving ? (
          <ActivityIndicator size="small" color="#f86f1a" />
        ) : (
          <Ionicons name="heart" size={22} color="#f86f1a" />
        )}
      </TouchableOpacity>

      {/* Imagen del producto */}
      <View style={styles.imageContainer}>
        {imageError ? (
          <View style={styles.imageFallback}>
            <Ionicons name="image-outline" size={48} color="#ccc" />
          </View>
        ) : (
          <Image
            source={{ uri: product.mainImage }}
            style={styles.productImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        )}
      </View>

      {/* Información del producto */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
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
    marginBottom: 12,
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
    height: 240,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  infoContainer: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  productName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1a1a1a',
    lineHeight: 20,
  },
  price: {
    fontSize: 20,
    fontWeight: '500',
    color: '#666',
    marginTop: 2,
  },
});

export default FavoriteCard;
