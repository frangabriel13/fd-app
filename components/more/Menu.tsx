import React, { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import { useAppDispatch } from '@/hooks/redux';
import { logoutAsync } from '@/store/slices/authSlice';
import { clearNotifications } from '@/store/slices/notificationSlice';
import { resetFavorites } from '@/store/slices/favoriteSlice';

// — Constantes de categorías —
const SHOP_CATEGORIES = {
  packs:    { genderId: 7, categoryId: 161 },
  blanqueria:{ genderId: 7, categoryId: 130 },
  lenceria: { genderId: 3, categoryId: 153 },
  calzado:  { genderId: 2, categoryId: 154 },
  bisuteria:{ genderId: 7, categoryId: 131 },
  telas:    { genderId: 7, categoryId: 162 },
  costura:  { genderId: 7, categoryId: 163 },
  maquinas: { genderId: 7, categoryId: 164 },
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

interface MenuItemConfig {
  icon: IoniconName;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}

type MenuSection = MenuItemConfig[];

// — Componente MenuItem —
const MenuItem = React.memo(({ icon, label, onPress, disabled }: MenuItemConfig) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    android_ripple={{ color: '#e5e7eb' }}
    style={({ pressed }) => [
      styles.pressable,
      pressed && !disabled && styles.itemPressed,
      disabled && styles.itemDisabled,
    ]}
  >
    <View style={styles.item}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={22} color={disabled ? '#9ca3af' : '#333'} />
      </View>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
      {disabled && <Text style={styles.comingSoon}>Próximamente</Text>}
    </View>
  </Pressable>
));

// — Separador —
const Divider = () => <View style={styles.divider} />;

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

  const sections: MenuSection[] = [
    [
      { icon: 'home-outline',        label: 'Inicio',        onPress: () => router.push('/(tabs)' as any) },
      { icon: 'storefront-outline',  label: 'Tienda',        onPress: () => router.push('/(tabs)/tienda') },
      { icon: 'cube-outline',        label: 'Packs/Combos',  onPress: () => navigateToShop(SHOP_CATEGORIES.packs) },
      { icon: 'radio-outline',       label: 'Live Shopping', onPress: () => router.push('/(tabs)/fabricantes') },
      { icon: 'person-outline',      label: 'Mi perfil',     onPress: () => router.push('/(tabs)/mi-cuenta') },
    ],
    [
      { icon: 'notifications-outline', label: 'Notificaciones',  onPress: () => router.push('/(tabs)/notificaciones' as any) },
      { icon: 'heart-outline',         label: 'Favoritos',       onPress: () => router.push('/(tabs)/favoritos') },
      { icon: 'bookmark-outline',      label: 'Tiendas seguidas',disabled: true },
      { icon: 'bag-check-outline',     label: 'Mis compras',     onPress: () => router.push('/(dashboard)/ver-pedidos') },
      { icon: 'headset-outline',       label: 'Ayuda',           disabled: true },
    ],
    [
      { icon: 'star-outline',      label: 'Productos destacados',           onPress: () => navigateToShop({ sortBy: 'featured' }) },
      { icon: 'sparkles-outline',  label: 'Nuevos ingresos',               onPress: () => navigateToShop({ sortBy: 'newest' }) },
      { icon: 'pricetag-outline',  label: 'Ofertas',                       onPress: () => navigateToShop({ sortBy: 'onSale' }) },
      { icon: 'bed-outline',       label: 'Blanquería',                    onPress: () => navigateToShop(SHOP_CATEGORIES.blanqueria) },
      { icon: 'woman-outline',     label: 'Lencería',                      onPress: () => navigateToShop(SHOP_CATEGORIES.lenceria) },
      { icon: 'walk-outline',      label: 'Calzado',                       onPress: () => navigateToShop(SHOP_CATEGORIES.calzado) },
      { icon: 'diamond-outline',   label: 'Bisutería',                     onPress: () => navigateToShop(SHOP_CATEGORIES.bisuteria) },
      { icon: 'layers-outline',    label: 'Telas textiles',                onPress: () => navigateToShop(SHOP_CATEGORIES.telas) },
      { icon: 'cut-outline',       label: 'Insumos para costura',          onPress: () => navigateToShop(SHOP_CATEGORIES.costura) },
      { icon: 'construct-outline', label: 'Máquinas textiles',             onPress: () => navigateToShop(SHOP_CATEGORIES.maquinas) },
    ],
    [
      { icon: 'log-out-outline', label: 'Cerrar sesión', onPress: handleLogout },
    ],
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {sections.map((section, sectionIndex) => (
        <React.Fragment key={sectionIndex}>
          {section.map((item) => (
            <MenuItem key={item.label} {...item} />
          ))}
          {sectionIndex < sections.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  pressable: {
    borderRadius: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  itemPressed: {
    backgroundColor: '#f3f4f6',
  },
  itemDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 32,
    marginRight: 12,
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  labelDisabled: {
    color: '#9ca3af',
  },
  comingSoon: {
    fontSize: 11,
    color: '#9ca3af',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
});

export default Menu;
