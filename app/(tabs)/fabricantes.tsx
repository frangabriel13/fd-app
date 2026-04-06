import { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, RefreshControl, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchAllLiveManufacturers, clearLiveManufacturers } from '@/store/slices/manufacturerSlice';
import type { LiveManufacturer } from '@/store/slices/manufacturerSlice';
import { Colors } from '@/constants/Colors';
import { useRefresh } from '@/hooks/useRefresh';
import ManufacturerItem from '@/components/fabricantes/ManufacturerItem';
import ManufacturerSkeleton from '@/components/fabricantes/ManufacturerSkeleton';
import { NUM_COLUMNS, H_PADDING, ITEM_GAP } from '@/components/fabricantes/constants';

const ItemSeparator = () => <View style={{ height: 20 }} />;

const FabricantesScreen = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const avatarSize = (width - H_PADDING * 2 - ITEM_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS - 16;

  const { liveManufacturers, loading, isLoadingMore, hasMoreData, currentPage, error } =
    useAppSelector((state) => state.manufacturer);

  useEffect(() => {
    dispatch(clearLiveManufacturers());
    dispatch(fetchAllLiveManufacturers({ page: 1, isFirstLoad: true }));
  }, [dispatch]);

  const { refreshing, onRefresh } = useRefresh(
    useCallback(() => {
      dispatch(clearLiveManufacturers());
      return dispatch(fetchAllLiveManufacturers({ page: 1, isFirstLoad: true }));
    }, [dispatch])
  );

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMoreData && !loading) {
      dispatch(fetchAllLiveManufacturers({ page: currentPage + 1, isFirstLoad: false }));
    }
  }, [dispatch, isLoadingMore, hasMoreData, loading, currentPage]);

  const handlePress = useCallback((manufacturer: LiveManufacturer) => {
    router.push(`/(tabs)/store/${manufacturer.id}`);
  }, [router]);

  const handleRetry = useCallback(() => {
    dispatch(clearLiveManufacturers());
    dispatch(fetchAllLiveManufacturers({ page: 1, isFirstLoad: true }));
  }, [dispatch]);

  const renderItem = useCallback(({ item }: { item: LiveManufacturer }) => (
    <ManufacturerItem item={item} avatarSize={avatarSize} onPress={() => handlePress(item)} />
  ), [avatarSize, handlePress]);

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.blue.dark} />
        <Text style={styles.footerText}>Cargando más...</Text>
      </View>
    );
  }, [isLoadingMore]);

  if (loading && liveManufacturers.length === 0) {
    return <View style={styles.container}><ManufacturerSkeleton itemSize={avatarSize} /></View>;
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="cloud-offline-outline" size={52} color={Colors.gray.default} />
        <Text style={styles.feedbackTitle}>Ocurrió un error</Text>
        <Text style={styles.feedbackText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={liveManufacturers}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={NUM_COLUMNS}
      style={styles.container}
      contentContainerStyle={[styles.content, liveManufacturers.length === 0 && styles.contentEmpty]}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={ItemSeparator}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Ionicons name="videocam-outline" size={52} color={Colors.gray.default} />
          <Text style={styles.feedbackTitle}>Sin fabricantes en vivo</Text>
          <Text style={styles.feedbackText}>Volvé más tarde para ver las transmisiones</Text>
        </View>
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.blue.dark]}
          tintColor={Colors.blue.dark}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: H_PADDING,
    paddingTop: 16,
    paddingBottom: 24,
  },
  contentEmpty: {
    flex: 1,
  },
  row: {
    justifyContent: 'flex-start',
    gap: ITEM_GAP,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  feedbackTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 13,
    color: Colors.gray.semiDark,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: Colors.gray.semiDark,
  },
  retryButton: {
    marginTop: 4,
    backgroundColor: Colors.blue.dark,
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default FabricantesScreen;
