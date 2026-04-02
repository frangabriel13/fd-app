import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchAllLiveManufacturers } from '../../store/slices/manufacturerSlice';
import Images from '@/constants/Images';

const AVATAR_SIZE = 60;
const ITEM_WIDTH = 76;

const logoDefault = Images.defaultImages.logoDefault;

// — Skeleton circular —
const SkeletonAvatar = () => {
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
    <View style={styles.item}>
      <Animated.View style={[styles.skeletonCircle, animatedStyle]} />
      <Animated.View style={[styles.skeletonName, animatedStyle]} />
    </View>
  );
};

// — Item individual —
type Manufacturer = {
  id: number;
  name: string;
  image: string | null;
  live: boolean;
};

type ManufacturerItemProps = {
  manufacturer: Manufacturer;
  onPress: () => void;
};

const ManufacturerItem = ({ manufacturer, onPress }: ManufacturerItemProps) => {
  const scale = useSharedValue(1);

  const animatedItemStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.item, animatedItemStyle]}>
        <View style={styles.avatarWrapper}>
          {/* Anillo exterior difuso (solo live) */}
          {manufacturer.live && <View style={styles.ringOuter} />}

          {/* Anillo interior */}
          <View style={[styles.ring, manufacturer.live ? styles.ringLive : styles.ringDefault]}>
            <Image
              source={manufacturer.image ? { uri: manufacturer.image } : logoDefault}
              style={styles.avatar}
              contentFit="cover"
              transition={200}
            />
          </View>

        </View>

        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {manufacturer.name}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

// — Componente principal —
const LiveManufacturers = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const manufacturerState = useAppSelector((state) => state.manufacturer);

  useEffect(() => {
    dispatch(fetchAllLiveManufacturers({ page: 1, limit: 8, isFirstLoad: true }));
  }, [dispatch]);

  const handleSeeMore = () => {
    router.push('/(tabs)/fabricantes');
  };

  const handleManufacturerPress = (manufacturer: Manufacturer) => {
    router.push(`/(tabs)/store/${manufacturer.id}`);
  };

  const { liveManufacturers, loading } = manufacturerState ?? { liveManufacturers: [], loading: false };
  const manufacturers = liveManufacturers || [];
  const isLoading = loading && manufacturers.length === 0;

  return (
    <View style={styles.container}>
      {/* Header — mismo patrón que Genders */}
      <Pressable style={styles.header} onPress={handleSeeMore}>
        <Text style={styles.title}>En vivo</Text>
        <View style={styles.titleAccent} />
        <Ionicons name="chevron-forward" size={20} color="#021344" />
      </Pressable>

      {/* Estado de carga */}
      {isLoading && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          scrollEnabled={false}
        >
          {[...Array(5)].map((_, i) => <SkeletonAvatar key={i} />)}
        </ScrollView>
      )}

      {/* Estado vacío */}
      {!isLoading && manufacturers.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Sin fabricantes en vivo ahora</Text>
        </View>
      )}

      {/* Lista */}
      {!isLoading && manufacturers.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {manufacturers.map((manufacturer) => (
            <ManufacturerItem
              key={manufacturer.id}
              manufacturer={manufacturer}
              onPress={() => handleManufacturerPress(manufacturer)}
            />
          ))}
        </ScrollView>
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
    color: '#021344',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  titleAccent: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#f3f4f6',
  },

  // — Scroll —
  scrollContent: {
    paddingHorizontal: 3,
    gap: 3,
  },

  // — Item —
  item: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    gap: 2,
  },

  // — Avatar —
  avatarWrapper: {
    width: AVATAR_SIZE + 16,
    height: AVATAR_SIZE + 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Anillo exterior difuso: crea el efecto de doble borde
  ringOuter: {
    position: 'absolute',
    width: AVATAR_SIZE + 14,
    height: AVATAR_SIZE + 14,
    borderRadius: (AVATAR_SIZE + 14) / 2,
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  // Anillo interior sólido
  ring: {
    width: AVATAR_SIZE + 6,
    height: AVATAR_SIZE + 6,
    borderRadius: (AVATAR_SIZE + 6) / 2,
    borderWidth: 2.5,
    padding: 2,
    backgroundColor: '#fff',
  },
  ringLive: {
    borderColor: '#ef4444',
  },
  ringDefault: {
    borderColor: '#e5e7eb',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#f3f4f6',
  },

  // — Nombre —
  name: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 13,
    maxWidth: ITEM_WIDTH,
    paddingHorizontal: 2,
  },

  // — Skeleton —
  skeletonCircle: {
    width: AVATAR_SIZE + 6,
    height: AVATAR_SIZE + 6,
    borderRadius: (AVATAR_SIZE + 6) / 2,
    backgroundColor: '#e5e7eb',
  },
  skeletonName: {
    width: 44,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },

  // — Vacío —
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#9ca3af',
    letterSpacing: 0.3,
  },
});

export default LiveManufacturers;
