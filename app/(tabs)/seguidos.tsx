import { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppDispatch, RootState } from '@/store';
import { fetchFollowedManufacturers, unfollowManufacturer } from '@/store/slices/userSlice';

const FollowedScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { followed, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchFollowedManufacturers());
  }, [dispatch]);

  const handleUnfollow = (manufacturerId: number) => {
    dispatch(unfollowManufacturer(manufacturerId.toString()));
  };

  const handleNavigate = (userId: number) => {
    router.push(`/(tabs)/store/${userId}`);
  };

  if (loading && followed.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#f86f1a" />
        <Text style={styles.loadingText}>Cargando tiendas...</Text>
      </View>
    );
  }

  if (!loading && followed.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="storefront-outline" size={80} color="#ddd" />
        <Text style={styles.emptyText}>Aún no seguís ninguna tienda</Text>
        <Text style={styles.emptySubtext}>
          Explorá fabricantes y seguí las tiendas que más te gusten
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tiendas seguidas</Text>
        <Text style={styles.subtitle}>
          {followed.length} {followed.length === 1 ? 'tienda' : 'tiendas'}
        </Text>
      </View>

      <FlatList
        data={followed}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => handleNavigate(item.userId)}
          >
            <Image
              source={
                item.image
                  ? { uri: item.image }
                  : require('@/assets/images/react-logo.png')
              }
              style={styles.avatar}
            />
            <View style={styles.cardInfo}>
              <Text style={styles.storeName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.storeLabel}>Ver tienda</Text>
            </View>
            <TouchableOpacity
              style={styles.unfollowButton}
              onPress={() => handleUnfollow(item.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.unfollowText}>Siguiendo</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 40,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#021344',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    gap: 8,
    paddingTop: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#021344',
    marginBottom: 2,
  },
  storeLabel: {
    fontSize: 13,
    color: '#f86f1a',
    fontWeight: '500',
  },
  unfollowButton: {
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  unfollowText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#262626',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default FollowedScreen;