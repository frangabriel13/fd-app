import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchAllLiveManufacturers, clearLiveManufacturers } from '../../store/slices/manufacturerSlice';
import Images from '@/constants/Images';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 4; // 16 padding horizontal * 2 + 16 gaps
const logoDefault = Images.defaultImages.logoDefault;

interface LiveManufacturer {
  id: number;
  name: string;
  image: string | null;
  live: boolean;
  tiktokUrl: string | null;
  user: {
    id: number;
    email: string;
  };
}

const FabricantesScreen = () => {
  const dispatch = useAppDispatch();
  const { 
    liveManufacturers, 
    loading, 
    isLoadingMore, 
    hasMoreData, 
    currentPage, 
    error 
  } = useAppSelector((state) => state.manufacturer);
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Limpiar y cargar datos iniciales
    dispatch(clearLiveManufacturers());
    dispatch(fetchAllLiveManufacturers({ page: 1, isFirstLoad: true }));
  }, [dispatch]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(clearLiveManufacturers());
    await dispatch(fetchAllLiveManufacturers({ page: 1, isFirstLoad: true }));
    setRefreshing(false);
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMoreData && !loading) {
      dispatch(fetchAllLiveManufacturers({ 
        page: currentPage + 1, 
        isFirstLoad: false 
      }));
    }
  }, [dispatch, isLoadingMore, hasMoreData, loading, currentPage]);

  const handleManufacturerPress = (manufacturer: LiveManufacturer) => {
    // TODO: Abrir el live del fabricante
    console.log('Abrir live de:', manufacturer.name);
  };

  const renderManufacturer = ({ item }: { item: LiveManufacturer }) => (
    <TouchableOpacity
      style={styles.manufacturerItem}
      onPress={() => handleManufacturerPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={item.image ? { uri: item.image } : logoDefault}
          style={[
            styles.avatar,
            item.live && styles.avatarLive
          ]}
          resizeMode="cover"
        />
        {item.live && <View style={styles.liveIndicator} />}
      </View>
      <Text style={styles.manufacturerName} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#0a7ea4" />
        <Text style={styles.loadingText}>Cargando más...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <Text style={styles.loadingText}>Cargando fabricantes...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay fabricantes en vivo</Text>
        <Text style={styles.emptySubText}>Vuelve más tarde para ver las transmisiones</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Shopping</Text>
      
      <FlatList
        data={liveManufacturers}
        renderItem={renderManufacturer}
        keyExtractor={(item) => item.id.toString()}
        numColumns={4}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#0a7ea4']}
            tintColor="#0a7ea4"
          />
        }
      />
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  contentContainer: {
    padding: 16,
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  manufacturerItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: ITEM_WIDTH - 8,
    height: ITEM_WIDTH - 8,
    borderRadius: (ITEM_WIDTH - 8) / 2,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  },
  avatarLive: {
    borderColor: '#ff4444',
    borderWidth: 3,
  },
  liveIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ff4444',
    borderWidth: 2,
    borderColor: '#fff',
  },
  manufacturerName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 4,
    lineHeight: 16,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 50,
    left: 16,
    right: 16,
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default FabricantesScreen;
