import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchAllLiveManufacturers } from '../../store/slices/manufacturerSlice';
import Images from '@/constants/Images';
import AntDesign from '@expo/vector-icons/AntDesign';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 84;
const logoDefault = Images.defaultImages.logoDefault;

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

  const handleManufacturerPress = (manufacturer: any) => {
    router.push(`/(tabs)/store/${manufacturer.id}`);
  };

  if (!manufacturerState) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </View>
    );
  }

  const { liveManufacturers, loading } = manufacturerState;
  const manufacturers = liveManufacturers || [];

  if (loading && manufacturers.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.liveDot} />
            <Text style={styles.title}>Live Shopping</Text>
          </View>
          <TouchableOpacity onPress={handleSeeMore} activeOpacity={0.6} style={styles.seeMoreBtn}>
            <Text style={styles.seeMoreText}>Ver más</Text>
            <AntDesign name="right" size={14} color="#f86f1a" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </View>
    );
  }

  if (manufacturers.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.liveDot} />
            <Text style={styles.title}>Live Shopping</Text>
          </View>
          <TouchableOpacity onPress={handleSeeMore} activeOpacity={0.6} style={styles.seeMoreBtn}>
            <Text style={styles.seeMoreText}>Ver más</Text>
            <AntDesign name="right" size={14} color="#f86f1a" />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay fabricantes en vivo</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.liveDot} />
          <Text style={styles.title}>Live Shopping</Text>
        </View>
        <TouchableOpacity onPress={handleSeeMore} activeOpacity={0.6} style={styles.seeMoreBtn}>
          <Text style={styles.seeMoreText}>Ver más</Text>
          <AntDesign name="right" size={14} color="#f86f1a" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {manufacturers.map((manufacturer) => (
          <TouchableOpacity
            key={manufacturer.id}
            style={styles.manufacturerItem}
            onPress={() => handleManufacturerPress(manufacturer)}
            activeOpacity={0.7}
          >
            <View style={styles.avatarContainer}>
              <View style={[styles.avatarRing, manufacturer.live && styles.avatarRingLive]}>
                <Image
                  source={manufacturer.image ? { uri: manufacturer.image } : logoDefault}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              </View>
              {manufacturer.live && (
                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>LIVE</Text>
                </View>
              )}
            </View>
            <Text style={styles.manufacturerName} numberOfLines={1}>
              {manufacturer.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  seeMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeMoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f86f1a',
  },
  scrollContainer: {
    paddingHorizontal: 12,
    gap: 14,
  },
  manufacturerItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  avatarRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    padding: 2,
    backgroundColor: '#fff',
  },
  avatarRingLive: {
    borderColor: '#ef4444',
    borderWidth: 2.5,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 33,
    backgroundColor: '#f8f8f8',
  },
  liveBadge: {
    position: 'absolute',
    bottom: -2,
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  liveBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  manufacturerName: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4b5563',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 2,
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#9ca3af',
  },
});

export default LiveManufacturers;
