import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';

const Notification = () => {
  const handleNotificationPress = () => {
    console.log('Notification pressed');
    // Aquí se añadirá la funcionalidad más adelante
  };

  return (
    <View className="relative">
      <TouchableOpacity
        onPress={handleNotificationPress}
        activeOpacity={0.7} // Mejora la experiencia táctil
        className="p-2 rounded-full" // Padding y borde redondeado
        accessibilityLabel="Notificaciones" // Para lectores de pantalla
        accessibilityRole="button" // Para entender qué es
      >
        <Ionicons
          name="notifications-outline"
          size={24}
          color="#f86f1a"
        />
      </TouchableOpacity>
      
      {/* Badge para indicar notificaciones no leídas (opcional) */}
      {/* Descomenta estas líneas cuando quieras mostrar un badge
      <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 items-center justify-center">
        <Text className="text-white text-xs font-bold">•</Text>
      </View>
      */}
    </View>
  );
};


export default Notification;