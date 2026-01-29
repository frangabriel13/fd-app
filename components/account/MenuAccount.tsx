import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { spacing, borderRadius, fontSize } from '../../constants/Styles';
import { Colors } from '../../constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useAppSelector } from '@/hooks/redux';

interface MenuOption {
  id: string;
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
}

interface MenuAccountProps {
  userRole?: string | null;
}

const MenuAccount = ({ userRole }: MenuAccountProps) => {
  const router = useRouter();
  const { user } = useAppSelector(state => state.user);

  // Función para manejar las acciones
  const handleAction = (action: string) => {
    switch (action) {
      case 'Subir producto':
        router.push('/(dashboard)/subir-producto/seleccionar-categoria');
        break;
      case 'Mis publicaciones':
        router.push('/(dashboard)/mis-publicaciones' as any);
        break;
      case 'Crear pack':
        Alert.alert('Acción', `Función: ${action}`, [{ text: 'OK' }]);
        break;
      case 'Configuración de perfil':
        router.push('/(dashboard)/editar-perfil' as any);
        break;
      case 'Ver mi tienda':
        if (user?.manufacturer?.id) {
          router.push(`/(tabs)/store/${user.manufacturer.id}` as any);
        } else {
          Alert.alert('Error', 'No se pudo obtener la información del fabricante');
        }
        break;
      case 'Ver órdenes':
        router.push('/(dashboard)/ver-ordenes' as any);
        break;
      case 'Ver pedidos':
        router.push('/(dashboard)/ver-pedidos' as any);
        break;
      case 'Ver usuarios':
        router.navigate('/(dashboard)/ver-usuarios/' as any);
        break;
      case 'Pedidos unificados':
        router.push('/(dashboard)/pedidos-unificados');
        break;
      case 'Mi perfil':
        Alert.alert('Acción', `Función: ${action}`, [{ text: 'OK' }]);
        break;
      default:
        Alert.alert('Acción', `Función: ${action}`, [{ text: 'OK' }]);
    }
  };

  // Definir las opciones del menú según el rol
  const getMenuOptions = (): MenuOption[] => {
    switch (userRole) {
      case 'manufacturer':
        return [
          {
            id: 'upload-product',
            title: 'Subir producto',
            icon: <AntDesign name="upload" size={24} color={Colors.blue.default} />,
            onPress: () => handleAction('Subir producto'),
          },
          {
            id: 'my-publications',
            title: 'Mis publicaciones',
            icon: <MaterialIcons name="edit" size={24} color={Colors.blue.default} />,
            onPress: () => handleAction('Mis publicaciones'),
          },
          {
            id: 'create-pack',
            title: 'Crear pack',
            icon: <Feather name="package" size={24} color={Colors.blue.default} />,
            onPress: () => handleAction('Crear pack'),
          },
          {
            id: 'profile-settings',
            title: 'Configuración de perfil',
            icon: <FontAwesome name="user-o" size={24} color={Colors.blue.default} />,
            onPress: () => handleAction('Configuración de perfil'),
          },
          {
            id: 'view-store',
            title: 'Ver mi tienda',
            icon: <Ionicons name="storefront-outline" size={24} color={Colors.blue.default} />,
            onPress: () => handleAction('Ver mi tienda'),
          },
          {
            id: 'view-orders',
            title: 'Ver órdenes',
            icon: <Ionicons name="receipt-outline" size={24} color={Colors.blue.default} />,
            onPress: () => handleAction('Ver órdenes'),
          }
        ];
      
      case 'wholesaler':
        return [
          {
            id: 'view-orders',
            title: 'Ver pedidos',
            icon: <Ionicons name="receipt-outline" size={24} color={Colors.blue.default} />,
            onPress: () => handleAction('Ver pedidos'),
          },
          {
            id: 'favourites',
            title: 'Favoritos',
            icon: <AntDesign name="heart" size={24} color={Colors.blue.default} />,
            onPress: () => handleAction('Favoritos'),
          },
          {
            id: 'view-purchases',
            title: 'Mis compras',
            icon: <MaterialIcons name="shopping-bag" size={24} color={Colors.blue.default} />,
            onPress: () => handleAction('Mis compras'),
          },
          {
            id: 'followed',
            title: 'Seguidos',
            icon: <Feather name="user-plus" size={24} color={Colors.blue.default} />,
            onPress: () => handleAction('Seguidos'),
          },
          {
            id: 'view-data',
            title: 'Mis datos',
            icon: <Feather name="user" size={24} color={Colors.blue.default} />,
            onPress: () => handleAction('Mis datos'),
          },
        ];
      
      case 'admin':
        return [
          {
            id: 'view-users',
            title: 'Ver usuarios',
            icon: <Feather name="users" size={24} color={Colors.blue.default} />,
            onPress: () => handleAction('Ver usuarios'),
          },
          {
            id: 'unify-orders',
            title: 'Pedidos unificados',
            icon: <Feather name="clipboard" size={24} color={Colors.blue.default} />,
            onPress: () => handleAction('Pedidos unificados'),
          },
        ];
      
      default:
        return [
          {
            id: 'default-option',
            title: 'Mi perfil',
            icon: <Feather name="user" size={24} color={Colors.blue.default} />,
            onPress: () => handleAction('Mi perfil'),
          },
        ];
    }
  };

  const menuOptions = getMenuOptions();

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        {menuOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.menuItem}
            onPress={option.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              {option.icon}
            </View>
            <Text style={styles.menuText}>{option.title}</Text>
            <AntDesign name="right" size={16} color={Colors.light.icon} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  menuText: {
    flex: 1,
    fontSize: fontSize.base,
    color: Colors.light.text,
    fontWeight: '500',
  },
});


export default MenuAccount;