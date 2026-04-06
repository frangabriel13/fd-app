import React, { useCallback } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import { useAppDispatch } from '@/hooks/redux';
import { logoutAsync } from '@/store/slices/authSlice';
import { clearNotifications } from '@/store/slices/notificationSlice';
import { resetFavorites } from '@/store/slices/favoriteSlice';
import { Colors } from '@/constants/Colors';

// — Constantes de categorías —
const SHOP_CATEGORIES = {
  packs:     { genderId: 7, categoryId: 161 },
  blanqueria:{ genderId: 7, categoryId: 130 },
  lenceria:  { genderId: 3, categoryId: 153 },
  calzado:   { genderId: 2, categoryId: 154 },
  bisuteria: { genderId: 7, categoryId: 131 },
  telas:     { genderId: 7, categoryId: 162 },
  costura:   { genderId: 7, categoryId: 163 },
  maquinas:  { genderId: 7, categoryId: 164 },
} as const;

const navigateToShop = (params: { genderId?: number; categoryId?: number; sortBy?: string }) => {
  const searchParams = new URLSearchParams();
  if (params.genderId)   searchParams.append('genderId', params.genderId.toString());
  if (params.categoryId) searchParams.append('categoryId', params.categoryId.toString());
  if (params.sortBy)     searchParams.append('sortBy', params.sortBy);
  const query = searchParams.toString();
  router.push((query ? `/(tabs)/tienda?${query}` : '/(tabs)/tienda') as any);
};

// — Tipos —
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface QuickActionConfig {
  icon:    IoniconName;
  label:   string;
  color:   string;
  onPress: () => void;
}

interface MenuItemConfig {
  icon:      IoniconName;
  iconBg:    string;
  iconColor: string;
  label:     string;
  onPress?:  () => void;
  disabled?: boolean;
}

interface MenuSectionConfig {
  title:  string;
  items:  MenuItemConfig[];
}

// — Quick action (accesos rápidos) —
const QuickAction = React.memo(({ icon, label, color, onPress }: QuickActionConfig) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.quickAction, pressed && styles.quickActionPressed]}
  >
    <View style={[styles.quickActionIcon, { backgroundColor: color + '18' }]}>
      <Ionicons name={icon} size={26} color={color} />
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </Pressable>
));

// — Menu item —
const MenuItem = React.memo(({ icon, iconBg, iconColor, label, onPress, disabled }: MenuItemConfig) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    android_ripple={{ color: '#f3f4f6' }}
    style={({ pressed }) => [pressed && !disabled && styles.itemPressed]}
  >
    <View style={[styles.item, disabled && styles.itemDisabled]}>
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text style={styles.itemLabel}>{label}</Text>
      {disabled
        ? <Text style={styles.comingSoon}>Próximamente</Text>
        : <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
      }
    </View>
  </Pressable>
));

// — Sección de menú —
const MenuSection = ({ title, items }: MenuSectionConfig) => (
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

// — Menú principal —
const Menu = () => {
  const dispatch = useAppDispatch();
  const { signOut } = useGoogleSignIn();

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      await dispatch(logoutAsync()).unwrap();
      dispatch(clearNotifications());
      dispatch(resetFavorites());
      router.replace('/(auth)/login');
    } catch {
      // el logout local ya se completó aunque falle el request
    }
  }, [dispatch, signOut]);

  const quickActions: QuickActionConfig[] = [
    { icon: 'bag-check-outline',   label: 'Mis compras',    color: Colors.blue.dark,    onPress: () => router.push('/(dashboard)/ver-pedidos') },
    { icon: 'heart-outline',       label: 'Favoritos',      color: '#db2777',           onPress: () => router.push('/(tabs)/favoritos') },
    { icon: 'notifications-outline',label: 'Notificaciones',color: Colors.orange.dark,  onPress: () => router.push('/(tabs)/notificaciones' as any) },
  ];

  const sections: MenuSectionConfig[] = [
    {
      title: 'Explorar',
      items: [
        { icon: 'home-outline',       iconBg: '#eff6ff', iconColor: '#3b82f6',         label: 'Inicio',            onPress: () => router.push('/(tabs)' as any) },
        { icon: 'storefront-outline', iconBg: '#fff7ed', iconColor: Colors.orange.dark, label: 'Tienda',            onPress: () => router.push('/(tabs)/tienda') },
        { icon: 'cube-outline',       iconBg: '#f5f3ff', iconColor: '#8b5cf6',         label: 'Packs/Combos',      onPress: () => navigateToShop(SHOP_CATEGORIES.packs) },
        { icon: 'radio-outline',      iconBg: '#fef2f2', iconColor: '#ef4444',         label: 'Live Shopping',     onPress: () => router.push('/(tabs)/fabricantes') },
        { icon: 'person-outline',     iconBg: '#eff6ff', iconColor: Colors.blue.dark,  label: 'Mi perfil',         onPress: () => router.push('/(tabs)/mi-cuenta') },
        { icon: 'bookmark-outline',   iconBg: '#ecfdf5', iconColor: '#10b981',         label: 'Tiendas seguidas',  disabled: true },
      ],
    },
    {
      title: 'Categorías',
      items: [
        { icon: 'star-outline',      iconBg: '#fefce8', iconColor: '#ca8a04',          label: 'Productos destacados',       onPress: () => navigateToShop({ sortBy: 'featured' }) },
        { icon: 'sparkles-outline',  iconBg: '#eff6ff', iconColor: '#3b82f6',          label: 'Nuevos ingresos',            onPress: () => navigateToShop({ sortBy: 'newest' }) },
        { icon: 'pricetag-outline',  iconBg: '#fff7ed', iconColor: Colors.orange.dark, label: 'Ofertas',                   onPress: () => navigateToShop({ sortBy: 'onSale' }) },
        { icon: 'bed-outline',       iconBg: '#f0fdf4', iconColor: '#16a34a',          label: 'Blanquería',                onPress: () => navigateToShop(SHOP_CATEGORIES.blanqueria) },
        { icon: 'woman-outline',     iconBg: '#fdf2f8', iconColor: '#db2777',          label: 'Lencería',                  onPress: () => navigateToShop(SHOP_CATEGORIES.lenceria) },
        { icon: 'walk-outline',      iconBg: '#f5f3ff', iconColor: '#8b5cf6',          label: 'Calzado',                   onPress: () => navigateToShop(SHOP_CATEGORIES.calzado) },
        { icon: 'diamond-outline',   iconBg: '#fdf2f8', iconColor: '#db2777',          label: 'Bisutería',                 onPress: () => navigateToShop(SHOP_CATEGORIES.bisuteria) },
        { icon: 'layers-outline',    iconBg: '#eff6ff', iconColor: '#3b82f6',          label: 'Telas textiles',            onPress: () => navigateToShop(SHOP_CATEGORIES.telas) },
        { icon: 'cut-outline',       iconBg: '#f0fdf4', iconColor: '#16a34a',          label: 'Insumos para costura',      onPress: () => navigateToShop(SHOP_CATEGORIES.costura) },
        { icon: 'construct-outline', iconBg: '#fff7ed', iconColor: Colors.orange.dark, label: 'Máquinas textiles',         onPress: () => navigateToShop(SHOP_CATEGORIES.maquinas) },
      ],
    },
    {
      title: 'Soporte',
      items: [
        { icon: 'headset-outline', iconBg: '#f3f4f6', iconColor: '#6b7280', label: 'Ayuda', disabled: true },
      ],
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Accesos rápidos */}
      <View style={styles.quickActionsRow}>
        {quickActions.map((action) => (
          <QuickAction key={action.label} {...action} />
        ))}
      </View>

      {/* Secciones */}
      {sections.map((section) => (
        <MenuSection key={section.title} {...section} />
      ))}

      {/* Cerrar sesión */}
      <Pressable
        onPress={handleLogout}
        android_ripple={{ color: '#fee2e2' }}
        style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutPressed]}
      >
        <Ionicons name="log-out-outline" size={20} color="#dc2626" />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 80,
  },

  // — Accesos rápidos —
  quickActionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  quickActionPressed: {
    backgroundColor: '#f9fafb',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },

  // — Secciones —
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
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
  itemDisabled: {
    opacity: 0.5,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
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
  comingSoon: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 60,
  },

  // — Cerrar sesión —
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fff',
  },
  logoutPressed: {
    backgroundColor: '#fef2f2',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#dc2626',
  },
});

export default Menu;
