import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { spacing, borderRadius, fontSize } from '../../constants/Styles';
import { Colors } from '../../constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';

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
  // Función para manejar las acciones (por ahora solo alertas)
  const handleAction = (action: string) => {
    Alert.alert('Acción', `Función: ${action}`, [{ text: 'OK' }]);
  };

  // Definir las opciones del menú según el rol
  const getMenuOptions = (): MenuOption[] => {
    switch (userRole) {
      case 'manufacturer':
        return [
          {
            id: 'upload-product',
            title: 'Subir producto',
            icon: <AntDesign name="upload" size={24} color={Colors.light.tint} />,
            onPress: () => handleAction('Subir producto'),
          },
          {
            id: 'edit-publications',
            title: 'Editar publicaciones',
            icon: <MaterialIcons name="edit" size={24} color={Colors.light.tint} />,
            onPress: () => handleAction('Editar publicaciones'),
          },
          {
            id: 'create-pack',
            title: 'Crear pack',
            icon: <Feather name="package" size={24} color={Colors.light.tint} />,
            onPress: () => handleAction('Crear pack'),
          },
          {
            id: 'profile-settings',
            title: 'Configuración de perfil',
            icon: <FontAwesome name="user-o" size={24} color={Colors.light.tint} />,
            onPress: () => handleAction('Configuración de perfil'),
          },
          {
            id: 'view-store',
            title: 'Ver mi tienda',
            icon: <Ionicons name="storefront-outline" size={24} color={Colors.light.tint} />,
            onPress: () => handleAction('Ver mi tienda'),
          },
          {
            id: 'view-orders',
            title: 'Ver órdenes',
            icon: <Ionicons name="receipt-outline" size={24} color={Colors.light.tint} />,
            onPress: () => handleAction('Ver órdenes'),
          }
        ];
      
      case 'wholesaler':
        return [
          {
            id: 'view-orders',
            title: 'Ver órdenes',
            icon: <MaterialIcons name="shopping-bag" size={24} color={Colors.light.tint} />,
            onPress: () => handleAction('Ver órdenes'),
          },
        ];
      
      case 'admin':
        return [
          {
            id: 'view-users',
            title: 'Ver usuarios',
            icon: <Feather name="users" size={24} color={Colors.light.tint} />,
            onPress: () => handleAction('Ver usuarios'),
          },
        ];
      
      default:
        return [
          {
            id: 'default-option',
            title: 'Mi perfil',
            icon: <Feather name="user" size={24} color={Colors.light.tint} />,
            onPress: () => handleAction('Mi perfil'),
          },
        ];
    }
  };

  const menuOptions = getMenuOptions();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú</Text>
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: spacing.md,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
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