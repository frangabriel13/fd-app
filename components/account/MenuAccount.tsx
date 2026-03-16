import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
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
      // case 'Crear pack':
      //   Alert.alert('Acción', `Función: ${action}`, [{ text: 'OK' }]);
      //   break;
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
      case 'Mis compras':
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
      case 'Mis datos':
        router.push('/(dashboard)/editar-perfil');
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
          // {
          //   id: 'create-pack',
          //   title: 'Crear pack',
          //   icon: <Feather name="package" size={24} color={Colors.blue.default} />,
          //   onPress: () => handleAction('Crear pack'),
          // },
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
            title: 'Mis compras',
            icon: <Ionicons name="receipt-outline" size={24} color={Colors.blue.default} />,
            onPress: () => handleAction('Mis compras'),
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
            id: 'edit-profile',
            title: 'Mis datos',
            icon: <FontAwesome name="user-o" size={24} color={Colors.blue.default} />,
            onPress: () => handleAction('Mis datos'),
          }
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

  // Obtener suscripción activa si es manufacturer
  const activeSubscription = userRole === 'manufacturer' 
    ? user?.manufacturer?.subscriptions?.find(sub => sub.status === 'active')
    : null;

  const planName = activeSubscription?.plan || 'Free';

  // Función para capitalizar el nombre del plan
  const getFormattedPlanName = (plan: string) => {
    const planLower = plan.toLowerCase();
    if (planLower === 'free') return 'Plan Gratuito';
    if (planLower === 'basic') return 'Plan Básico';
    if (planLower === 'premium') return 'Plan Premium';
    return plan;
  };

  // Función para obtener color del plan
  const getPlanColor = (plan: string) => {
    const planLower = plan.toLowerCase();
    if (planLower === 'free') return '#6B7280';
    if (planLower === 'basic') return Colors.blue.default;
    if (planLower === 'premium') return '#F59E0B';
    return Colors.blue.default;
  };

  // Función para abrir WhatsApp
  const handleContactAdmin = () => {
    const phoneNumber = '5491234567890'; // Reemplaza con el número del admin
    const message = encodeURIComponent('Hola, me gustaría cambiar mi plan de suscripción.');
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'No se pudo abrir WhatsApp');
        }
      })
      .catch(() => Alert.alert('Error', 'No se pudo abrir WhatsApp'));
  };

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

      {/* Sección de suscripción (solo para manufacturers) */}
      {userRole === 'manufacturer' && (
        <View style={styles.subscriptionContainer}>
          <View style={styles.subscriptionHeader}>
            <MaterialIcons name="card-membership" size={20} color={getPlanColor(planName)} />
            <Text style={styles.subscriptionTitle}>Mi Suscripción</Text>
          </View>
          <View style={styles.subscriptionContent}>
            <View style={styles.planInfo}>
              <Text style={styles.subscriptionPlan}>{getFormattedPlanName(planName)}</Text>
              <View style={[styles.planBadge, { backgroundColor: getPlanColor(planName) }]}>
                <Text style={styles.planBadgeText}>{planName.toUpperCase()}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.whatsappButton}
              onPress={handleContactAdmin}
              activeOpacity={0.7}
            >
              <FontAwesome name="whatsapp" size={20} color="#25D366" />
              <Text style={styles.whatsappButtonText}>Cambiar plan</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  subscriptionContainer: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  subscriptionTitle: {
    fontSize: fontSize.sm,
    color: Colors.light.icon,
    marginLeft: spacing.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subscriptionContent: {
    gap: spacing.md,
  },
  planInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subscriptionPlan: {
    fontSize: fontSize.lg,
    color: Colors.light.text,
    fontWeight: '700',
  },
  planBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  planBadgeText: {
    color: '#fff',
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#25D366',
    gap: spacing.xs,
  },
  whatsappButtonText: {
    color: '#25D366',
    fontSize: fontSize.base,
    fontWeight: '600',
  },
});


export default MenuAccount;