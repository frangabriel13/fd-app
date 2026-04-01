import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { useAppSelector } from '@/hooks/redux';

const Notification = () => {
  const unreadCount = useAppSelector(state => state.notifications.unreadCount);

  return (
    <View className="relative">
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/notificaciones')}
        activeOpacity={0.7}
        accessibilityLabel="Notificaciones"
        accessibilityRole="button"
      >
        <Ionicons name="notifications-outline" size={24} color={Colors.orange.light} />
      </TouchableOpacity>
      {unreadCount > 0 && (
        <View className="absolute -top-1.5 -right-1.5 bg-red-500 rounded-full min-w-[18px] h-[18px] px-0.5 items-center justify-center">
          <Text className="text-white font-bold" style={{ fontSize: 10 }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Notification;
