import { View, Text, StyleSheet, Pressable, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeInDown } from 'react-native-reanimated';
import { removeFavorite, selectRemovingProductId } from '@/store/slices/favoriteSlice';
import { AppDispatch, RootState } from '@/store';
import { Colors } from '@/constants/Colors';
import { shadows } from '@/constants/Styles';
import { formatPrice } from '@/utils/formatPrice';

interface FavoriteCardProps {
  product: {
    productId: number;
    userId: number;
    name: string;
    mainImage: string;
    price: string;
    logo: string | null;
  };
  index?: number;
}

const IMAGE_SIZE = 100;

const FavoriteCard = ({ product, index = 0 }: FavoriteCardProps) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const removingProductId = useSelector((state: RootState) => selectRemovingProductId(state));
  const isRemoving = removingProductId === product.productId;

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = () => { scale.value = withSpring(0.985, { damping: 15, stiffness: 300 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); };

  const handleProductPress = () => {
    router.push(`/(tabs)/producto/${product.productId}` as any);
  };

  const handleRemoveFavorite = async () => {
    try {
      await dispatch(removeFavorite(product.productId)).unwrap();
    } catch { /* el slice maneja el error en estado global */ }
  };

  const numericPrice = parseFloat(product.price);
  const displayPrice = isNaN(numericPrice) ? product.price : formatPrice(numericPrice);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 40).duration(250)}
      style={animatedStyle}
    >
      <Pressable
        onPress={handleProductPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={{ color: '#e5e7eb' }}
        style={styles.card}
      >
        {/* Imagen */}
        <View style={styles.imageWrap}>
          {product.mainImage ? (
            <Image
              source={{ uri: product.mainImage }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={28} color={Colors.gray.default} />
            </View>
          )}
          {product.logo ? (
            <View style={styles.logoBadge}>
              <Image source={{ uri: product.logo }} style={styles.logo} resizeMode="cover" />
            </View>
          ) : null}
        </View>

        {/* Información */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {product.name}
          </Text>

          <Text style={styles.price}>{displayPrice}</Text>

          {/* Footer: botón eliminar */}
          <View style={styles.footer}>
            <Pressable
              onPress={handleRemoveFavorite}
              disabled={isRemoving}
              android_ripple={{ color: '#fee2e2', borderless: false }}
              style={({ pressed }) => [styles.removeBtn, pressed && styles.removeBtnPressed]}
              hitSlop={8}
            >
              {isRemoving ? (
                <ActivityIndicator size="small" color={Colors.general.error} />
              ) : (
                <>
                  <Ionicons name="trash-outline" size={13} color={Colors.general.error} />
                  <Text style={styles.removeBtnText}>Eliminar</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.sm,
  },

  // ── Imagen ──────────────────────────
  imageWrap: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    flexShrink: 0,
    backgroundColor: Colors.gray.light,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  logo: {
    width: '100%',
    height: '100%',
  },

  // ── Información ─────────────────────
  info: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    lineHeight: 18,
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.blue.dark,
    marginTop: 4,
  },

  // ── Footer ──────────────────────────
  footer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  removeBtnPressed: {
    backgroundColor: '#fee2e2',
  },
  removeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.general.error,
  },
});

export default FavoriteCard;
