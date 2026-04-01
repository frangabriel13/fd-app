import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { useAppSelector } from '@/hooks/redux';

const Notification = () => {
  const unreadCount = useAppSelector(state => state.notifications.unreadCount);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/notificaciones')}
        activeOpacity={0.7}
        accessibilityLabel="Notificaciones"
        accessibilityRole="button"
      >
        <Ionicons name="notifications-outline" size={24} color={Colors.orange.light} />
      </TouchableOpacity>
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});

export default Notification;