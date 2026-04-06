import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeIn } from 'react-native-reanimated';
import { removeFavorite, selectRemovingProductId } from '@/store/slices/favoriteSlice';
import { AppDispatch, RootState } from '@/store';
import { Colors } from '@/constants/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 3;
const NUM_COLUMNS = 2;
export const FAV_CARD_WIDTH = (SCREEN_WIDTH - CARD_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

interface FavoriteCardProps {
  product: {
    productId: number;
    userId: number;
    name: string;
    mainImage: string;
    price: string;
    logo: string | null;
  };
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ product }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const removingProductId = useSelector((state: RootState) => selectRemovingProductId(state));
  const isRemoving = removingProductId === product.productId;

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = () => scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  const handlePressOut = () => scale.value = withSpring(1, { damping: 15, stiffness: 300 });

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

  const formatPrice = (price: string) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(parseFloat(price));

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
          {product.logo && (
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: product.logo }}
                style={styles.logoImage}
                contentFit="contain"
              />
            </View>
          )}
          <Pressable
            style={styles.heartButton}
            onPress={handleRemoveFavorite}
            disabled={isRemoving}
            hitSlop={10}
          >
            {isRemoving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="heart" size={22} color={Colors.orange.dark} style={styles.heartIcon} />
            )}
          </Pressable>
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
};

const styles = StyleSheet.create({
  card: {
    width: FAV_CARD_WIDTH,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: FAV_CARD_WIDTH * 1.3,
    backgroundColor: '#f3f4f6',
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
  heartButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
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

export default FavoriteCard;
