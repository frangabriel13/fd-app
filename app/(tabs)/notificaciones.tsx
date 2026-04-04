import { useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
  markAllAsRead,
} from '@/store/slices/notificationSlice';
import type { AppNotification } from '@/store/slices/notificationSlice';

export default function NotificacionesScreen() {
  const dispatch = useAppDispatch();
  const { notifications, loading, unreadCount, currentPage, totalPages } =
    useAppSelector(state => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications({ page: 1 }));
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loading) {
      dispatch(fetchNotifications({ page: currentPage + 1 }));
    }
  };

  const handlePress = useCallback((item: AppNotification) => {
    if (!item.isRead) dispatch(markAsRead(item.id));

    if (item.type === 'new_product' && item.data?.productId) {
      router.push(`/(tabs)/producto/${item.data.productId}` as any);
    } else if (item.type === 'live_started' && item.data?.manufacturerId) {
      router.push(`/(tabs)/store/${item.data.manufacturerId}` as any);
    }
  }, [dispatch]);

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Ahora';
    if (mins < 60) return `Hace ${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${Math.floor(hours / 24)}d`;
  };

  const renderItem = useCallback(({ item }: { item: AppNotification }) => (
    <TouchableOpacity
      style={[styles.item, !item.isRead && styles.unread]}
      onPress={() => handlePress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconCircle, {
        backgroundColor: item.type === 'live_started' ? '#fef2f2' : '#eff6ff',
      }]}>
        <Ionicons
          name={item.type === 'live_started' ? 'wifi' : 'cube-outline'}
          size={22}
          color={item.type === 'live_started' ? '#ef4444' : '#3b82f6'}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.itemTitle, !item.isRead && styles.bold]}>{item.title}</Text>
        <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
        <Text style={styles.time}>{getTimeAgo(item.createdAt)}</Text>
      </View>
      {!item.isRead && <View style={styles.dot} />}
    </TouchableOpacity>
  ), [handlePress]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={() => dispatch(markAllAsRead())}>
            <Text style={styles.markAll}>Marcar todas como leídas</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={!loading ? (
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>No tenés notificaciones</Text>
            <Text style={styles.emptySubtext}>
              Seguí fabricantes para recibir alertas de nuevos productos y lives
            </Text>
          </View>
        ) : null}
        ListFooterComponent={loading
          ? <ActivityIndicator size="small" color="#f86f1a" style={{ padding: 16 }} />
          : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#021344' },
  markAll: { fontSize: 13, color: '#f86f1a', fontWeight: '600' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  unread: { backgroundColor: '#fef9f1' },
  iconCircle: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  content: { flex: 1 },
  itemTitle: { fontSize: 14, color: '#1f2937', marginBottom: 2 },
  bold: { fontWeight: '700' },
  body: { fontSize: 13, color: '#6b7280', marginBottom: 4 },
  time: { fontSize: 11, color: '#9ca3af' },
  dot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#f86f1a', marginLeft: 8,
  },
  empty: {
    alignItems: 'center', paddingTop: 100, paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18, fontWeight: '600', color: '#374151',
    marginTop: 16, textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14, color: '#9ca3af',
    textAlign: 'center', marginTop: 8,
  },
});
