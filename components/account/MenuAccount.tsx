import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useAppSelector } from '@/hooks/redux';
import { Colors } from '../../constants/Colors';

const ICON_BG    = '#e8edf5';
const ICON_COLOR = Colors.blue.dark;

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface MenuItemConfig {
  icon: IoniconName;
  label: string;
  onPress: () => void;
}

interface MenuSectionConfig {
  title: string;
  items: MenuItemConfig[];
}

interface MenuAccountProps {
  userRole?: string | null;
}

// — Item de menú —
const MenuItem = React.memo(function MenuItem({ icon, label, onPress }: MenuItemConfig) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: '#f3f4f6' }}
      style={({ pressed }) => pressed && styles.itemPressed}
    >
      <View style={styles.item}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={18} color={ICON_COLOR} />
        </View>
        <Text style={styles.itemLabel}>{label}</Text>
        <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
      </View>
    </Pressable>
  );
});

// — Sección de menú —
function MenuSection({ title, items }: MenuSectionConfig) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>
        {items.map((item, index) => (
          <React.Fragment key={item.label}>
            <MenuItem {...item} />
            {index < items.length - 1 && <View style={styles.separator} />}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

// — Menú principal —
const MenuAccount = ({ userRole }: MenuAccountProps) => {
  const router = useRouter();
  const { user } = useAppSelector(state => state.user);

  // Plan info para manufacturers
  const activeSubscription =
    userRole === 'manufacturer'
      ? user?.manufacturer?.subscriptions?.find(sub => sub.status === 'active')
      : null;
  const planName = activeSubscription?.plan || 'Free';

  const getFormattedPlanName = (plan: string) => {
    const p = plan.toLowerCase();
    if (p === 'free')    return 'Plan Gratuito';
    if (p === 'basic')   return 'Plan Básico';
    if (p === 'premium') return 'Plan Premium';
    return plan;
  };

  const getPlanColor = (plan: string) => {
    const p = plan.toLowerCase();
    if (p === 'free')    return '#6B7280';
    if (p === 'basic')   return Colors.blue.default;
    if (p === 'premium') return '#F59E0B';
    return Colors.blue.default;
  };

  const handleContactAdmin = () => {
    const phoneNumber = '5491234567890';
    const message = encodeURIComponent('Hola, me gustaría cambiar mi plan de suscripción.');
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) Linking.openURL(url);
        else Alert.alert('Error', 'No se pudo abrir WhatsApp');
      })
      .catch(() => Alert.alert('Error', 'No se pudo abrir WhatsApp'));
  };

  const getSections = (): MenuSectionConfig[] => {
    switch (userRole) {
      case 'manufacturer':
        return [
          {
            title: 'Gestión',
            items: [
              {
                icon: 'cloud-upload-outline',
                label: 'Subir producto',
                onPress: () => router.push('/(dashboard)/subir-producto/seleccionar-categoria'),
              },
              {
                icon: 'albums-outline',
                label: 'Mis publicaciones',
                onPress: () => router.push('/(dashboard)/mis-publicaciones' as any),
              },
              {
                icon: 'receipt-outline',
                label: 'Ver órdenes',
                onPress: () => router.push('/(dashboard)/ver-ordenes' as any),
              },
            ],
          },
          {
            title: 'Mi negocio',
            items: [
              {
                icon: 'storefront-outline',
                label: 'Ver mi tienda',
                onPress: () => {
                  if (user?.manufacturer?.id)
                    router.push(`/(tabs)/store/${user.manufacturer.id}` as any);
                  else Alert.alert('Error', 'No se pudo obtener la información del fabricante');
                },
              },
              {
                icon: 'person-circle-outline',
                label: 'Configuración de perfil',
                onPress: () => router.push('/(dashboard)/editar-perfil' as any),
              },
            ],
          },
        ];

      case 'wholesaler':
        return [
          {
            title: 'Mi cuenta',
            items: [
              {
                icon: 'bag-check-outline',
                label: 'Mis compras',
                onPress: () => router.push('/(dashboard)/ver-pedidos' as any),
              },
              {
                icon: 'heart-outline',
                label: 'Favoritos',
                onPress: () => router.push('/(tabs)/favoritos' as any),
              },
              {
                icon: 'bookmark-outline',
                label: 'Tiendas seguidas',
                onPress: () => router.push('/(tabs)/seguidos' as any),
              },
              {
                icon: 'person-circle-outline',
                label: 'Mis datos',
                onPress: () => router.push('/(dashboard)/editar-perfil'),
              },
            ],
          },
        ];

      case 'admin':
        return [
          {
            title: 'Administración',
            items: [
              {
                icon: 'people-outline',
                label: 'Ver usuarios',
                onPress: () => router.navigate('/(dashboard)/ver-usuarios/' as any),
              },
              {
                icon: 'list-outline',
                label: 'Pedidos unificados',
                onPress: () => router.push('/(dashboard)/pedidos-unificados'),
              },
            ],
          },
        ];

      default:
        return [
          {
            title: 'Mi cuenta',
            items: [
              {
                icon: 'person-outline',
                label: 'Mi perfil',
                onPress: () => Alert.alert('Acción', 'Mi perfil', [{ text: 'OK' }]),
              },
            ],
          },
        ];
    }
  };

  const sections = getSections();

  return (
    <View style={styles.container}>
      {sections.map(section => (
        <MenuSection key={section.title} {...section} />
      ))}

      {/* Sección de suscripción — solo manufacturers */}
      {userRole === 'manufacturer' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suscripción</Text>
          <View style={styles.subscriptionCard}>
            {/* Info del plan */}
            <View style={styles.planRow}>
              <View style={[styles.planAccent, { backgroundColor: getPlanColor(planName) }]} />
              <View style={styles.planInfo}>
                <Text style={styles.planLabel}>Tu plan actual</Text>
                <Text style={styles.planName}>{getFormattedPlanName(planName)}</Text>
              </View>
              <View style={[styles.planBadge, { backgroundColor: getPlanColor(planName) }]}>
                <Text style={styles.planBadgeText}>{planName.toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.subscriptionSeparator} />

            {/* Botón cambiar plan via WhatsApp */}
            <Pressable
              onPress={handleContactAdmin}
              android_ripple={{ color: '#f0fdf4' }}
              style={({ pressed }) => pressed && styles.whatsappPressed}
            >
              <View style={styles.whatsappRow}>
                <View style={[styles.iconBox, { backgroundColor: '#f0fdf4' }]}>
                  <FontAwesome name="whatsapp" size={18} color="#25D366" />
                </View>
                <Text style={styles.whatsappLabel}>Cambiar plan</Text>
                <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
              </View>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },

  // — Secciones —
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },

  // — Item —
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  itemPressed: {
    backgroundColor: '#f9fafb',
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  itemLabel: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 60,
  },

  // — Suscripción —
  subscriptionCard: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  planAccent: {
    width: 4,
    height: 38,
    borderRadius: 2,
    flexShrink: 0,
  },
  planInfo: {
    flex: 1,
    gap: 2,
  },
  planLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
  planName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  planBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  planBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  subscriptionSeparator: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },
  whatsappRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  whatsappPressed: {
    backgroundColor: '#f0fdf4',
  },
  whatsappLabel: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
});

export default MenuAccount;
