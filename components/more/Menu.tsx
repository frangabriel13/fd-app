import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Foundation from '@expo/vector-icons/Foundation';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { BodyText } from '../ui';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import { useAppDispatch } from '@/hooks/redux';
import { logoutAsync } from '@/store/slices/authSlice';
import { clearNotifications } from '@/store/slices/notificationSlice';
import { resetFavorites } from '@/store/slices/favoriteSlice';
import { router } from 'expo-router';

interface MenuItemProps {
  icon: string;
  label: string;
  IconComponent?: any; // Puede ser AntDesign, Ionicons, MaterialIcons, etc.
  iconSize?: number;
  iconStyle?: object;
  onPress?: () => void;
}

const MenuItem = ({ 
  icon, 
  label, 
  IconComponent = AntDesign, 
  iconSize = 24,
  iconStyle = {},
  onPress,
}: MenuItemProps) => (
  <Pressable
    style={({ pressed }) => [
        styles.item,
        pressed && styles.pressedItem
      ]}
      android_ripple={{ color: '#e5e7eb' }}
      onPress={onPress}
    >
    <View style={styles.item}>
      <View style={styles.iconContainer}>
        <IconComponent 
          name={icon} 
          size={iconSize} 
          color="#333" 
          style={[styles.defaultIcon, iconStyle]} 
        />
      </View>
      <BodyText style={{ color: 'black' }}>{label}</BodyText>
    </View>
  </Pressable>
);

const navigateToShop = (params: { genderId?: number; categoryId?: number; sortBy?: string }) => {
  const searchParams = new URLSearchParams();
  if (params.genderId) searchParams.append('genderId', params.genderId.toString());
  if (params.categoryId) searchParams.append('categoryId', params.categoryId.toString());
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  
  const queryString = searchParams.toString();
  const route = queryString ? `/(tabs)/tienda?${queryString}` : '/(tabs)/tienda';
  router.push(route as any);
};

const Menu = () => {
  const dispatch = useAppDispatch();
  const { signOut } = useGoogleSignIn();

  const handleLogout = async () => {
    try {
      await signOut();
      await dispatch(logoutAsync()).unwrap();
      dispatch(clearNotifications());
      dispatch(resetFavorites());
      router.replace('/(auth)/login');
    } catch(error) {
      // silenciar error de logout
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
    >
      {/* Primera lista */}
      <View>
        <MenuItem 
          icon="home" 
          label="Inicio" 
          onPress={() => router.push('/(tabs)' as any)}
        />
        <MenuItem 
          icon="storefront-outline" 
          label="Tienda" 
          IconComponent={Ionicons}
          onPress={() => router.push('/(tabs)/tienda')}
        />
        <MenuItem 
          icon="package" 
          label="Packs/Combos" 
          IconComponent={Octicons}
          onPress={() => navigateToShop({ genderId: 7, categoryId: 161 })}
        />
        <MenuItem 
          icon="wifi" 
          label="Live Shopping" 
          IconComponent={FontAwesome6}
          iconSize={18}
          iconStyle={{ transform: [{ rotate: '45deg' }] }}
          onPress={() => router.push('/(tabs)/fabricantes')}
        />
        <MenuItem 
          icon="user"
          label="Mi perfil"
          onPress={() => router.push('/(tabs)/mi-cuenta')}
        />
      </View>

      {/* Primera línea divisoria */}
      <View style={styles.divider} />

      {/* Segunda lista */}
      <View>
        <MenuItem icon="notifications-outline" label="Notificaciones" IconComponent={Ionicons} onPress={() => router.push('/(tabs)/notificaciones' as any)} />
        <MenuItem 
          icon="hearto" 
          label="Favoritos" 
          IconComponent={AntDesign}
          onPress={() => router.push('/(tabs)/favoritos')}
        />
        <MenuItem icon="store-plus-outline" label="Tiendas seguidas" IconComponent={MaterialCommunityIcons} />
        <MenuItem 
          icon="bag-check-outline" 
          label="Mis compras" 
          IconComponent={Ionicons}
          onPress={() => router.push('/(dashboard)/ver-pedidos')}
        />
        <MenuItem icon="headphones-simple" label="Ayuda" IconComponent={FontAwesome6} />
      </View>

      {/* Segunda línea divisoria */}
      <View style={styles.divider} />

      {/* Tercera lista */}
      <View>
        <MenuItem 
          icon="staro" 
          label="Productos destacados"
          onPress={() => navigateToShop({ sortBy: 'featured' })}
        />
        <MenuItem 
          icon="burst-new" 
          label="Nuevos ingresos" 
          IconComponent={Foundation}
          onPress={() => navigateToShop({ sortBy: 'newest' })}
        />
        <MenuItem 
          icon="tago" 
          label="Ofertas"
          onPress={() => navigateToShop({ sortBy: 'onSale' })}
        />
        <MenuItem 
          icon="bed-outline" 
          label="Blanquería" 
          IconComponent={Ionicons}
          onPress={() => navigateToShop({ genderId: 7, categoryId: 130 })}
        />
        <MenuItem 
          icon="woman-outline" 
          label="Lencería" 
          IconComponent={Ionicons}
          onPress={() => navigateToShop({ genderId: 3, categoryId: 153 })}
        />
        <MenuItem 
          icon="shoe-sneaker" 
          label="Calzado" 
          IconComponent={MaterialCommunityIcons}
          onPress={() => navigateToShop({ genderId: 2, categoryId: 154 })}
        />
        <MenuItem 
          icon="diamond" 
          label="Bisutería" 
          IconComponent={FontAwesome}
          onPress={() => navigateToShop({ genderId: 7, categoryId: 131 })}
        />
        <MenuItem 
          icon="layers-outline" 
          label="Telas textiles" 
          IconComponent={Ionicons}
          onPress={() => navigateToShop({ genderId: 7, categoryId: 162 })}
        />
        <MenuItem 
          icon="scissors" 
          label="Insumos para costura y confección" 
          IconComponent={FontAwesome}
          onPress={() => navigateToShop({ genderId: 7, categoryId: 163 })}
        />
        <MenuItem 
          icon="tool" 
          label="Máquinas textiles"
          onPress={() => navigateToShop({ genderId: 7, categoryId: 164 })}
        />
      </View>

      {/* Tercera línea divisoria */}
      <View style={styles.divider} />

      {/* Cuarta lista */}
      <View>
        <MenuItem icon="poweroff" label="Cerrar sesión" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingVertical: 4,
  },
  pressedItem: {
    backgroundColor: '#f3f4f6',
  },
  iconContainer: {
    width: 32, // Ancho fijo para mantener alineación
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultIcon: {
    // Estilos base para todos los íconos
    color: 'black',
  },
  divider: {
    height: 1,
    backgroundColor: '#d1d5db',
    width: '100%',
    marginVertical: 16,
  },
});


export default Menu;