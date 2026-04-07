import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import type { CartManufacturerDisplay } from '@/types/cart';
import DetailCart from './DetailCart';

interface ManufacturerCartProps {
  manufacturer: CartManufacturerDisplay;
  onRemoveManufacturer?: (manufacturerId: number) => void;
  onCreateOrder?: (manufacturer: CartManufacturerDisplay) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price);

const ManufacturerCart: React.FC<ManufacturerCartProps> = ({
  manufacturer,
  onRemoveManufacturer,
  onCreateOrder,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const measuredHeight = useRef(0);
  const heightAnim = useSharedValue(0);
  const rotateAnim = useSharedValue(0);

  const toggle = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    heightAnim.value = withTiming(next ? measuredHeight.current : 0, { duration: 280 });
    rotateAnim.value = withTiming(next ? 1 : 0, { duration: 280 });
  };

  const animatedContent = useAnimatedStyle(() => ({
    height: heightAnim.value,
    overflow: 'hidden',
  }));

  const animatedChevron = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateAnim.value * 180}deg` }],
  }));

  const uniqueProductCount = manufacturer.items.reduce<string[]>((acc, item) => {
    if (!acc.includes(item.productId)) acc.push(item.productId);
    return acc;
  }, []).length;

  const hasMinPurchase = !!manufacturer.minPurchase && manufacturer.minPurchase > 0;
  const meetsMinPurchase = !hasMinPurchase || manufacturer.subtotal >= manufacturer.minPurchase!;
  const remaining = hasMinPurchase ? manufacturer.minPurchase! - manufacturer.subtotal : 0;
  const progress = hasMinPurchase ? Math.min(manufacturer.subtotal / manufacturer.minPurchase!, 1) : 1;

  return (
    <View style={styles.card}>

      {/* ── Header ─────────────────────────────────── */}
      <Pressable
        onPress={toggle}
        android_ripple={{ color: '#e5e7eb' }}
        style={({ pressed }) => pressed && styles.headerPressed}
      >
        <View style={styles.header}>
          {/* Logo + Nombre → navega a la tienda del fabricante */}
          <Pressable
            onPress={() => router.push(`/(tabs)/store/${manufacturer.manufacturerEntityId ?? manufacturer.manufacturerId}` as any)}
            android_ripple={{ color: '#e5e7eb', borderless: false }}
            style={styles.manufacturerLink}
          >
            <View style={styles.logoWrap}>
              {manufacturer.manufacturerLogo && manufacturer.manufacturerLogo !== 'undefined' ? (
                <Image
                  source={{ uri: manufacturer.manufacturerLogo }}
                  style={styles.logo}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.logoPlaceholder}>
                  <Ionicons name="storefront-outline" size={16} color={Colors.gray.semiDark} />
                </View>
              )}
            </View>

            <View style={styles.headerInfo}>
              <Text style={styles.manufacturerName} numberOfLines={1}>
                {manufacturer.manufacturerName ?? 'Fabricante'}
              </Text>
              <Text style={styles.headerMeta}>
                {manufacturer.totalItems}{' '}
                {manufacturer.totalItems === 1 ? 'unidad' : 'unidades'} ·{' '}
                {uniqueProductCount}{' '}
                {uniqueProductCount === 1 ? 'producto' : 'productos'}
              </Text>
            </View>
          </Pressable>

          {/* Subtotal + chevron */}
          <View style={styles.headerRight}>
            <Text style={styles.subtotal}>{formatPrice(manufacturer.subtotal)}</Text>
            <View style={styles.chevronRow}>
              <Text style={styles.expandHint}>{isExpanded ? 'Ocultar' : 'Ver detalle'}</Text>
              <Animated.View style={animatedChevron}>
                <Ionicons name="chevron-down" size={18} color={Colors.blue.dark} />
              </Animated.View>
            </View>
          </View>
        </View>
      </Pressable>

      {/* ── Separador post-header ───────────────────── */}
      <View style={styles.divider} />

      {/* ── Compra mínima (progress bar) ────────────── */}
      {hasMinPurchase && (
        <View style={styles.minSection}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress * 100}%` },
                meetsMinPurchase && styles.progressFillMet,
              ]}
            />
          </View>
          {meetsMinPurchase ? (
            <View style={styles.minRow}>
              <Ionicons name="checkmark-circle" size={12} color={Colors.general.success} />
              <Text style={styles.minMetText}>Mínimo de compra alcanzado</Text>
            </View>
          ) : (
            <Text style={styles.minPendingText}>
              Te faltan{' '}
              <Text style={styles.minPendingAmount}>{formatPrice(remaining)}</Text>
              {' '}para el mínimo de {formatPrice(manufacturer.minPurchase!)}
            </Text>
          )}
        </View>
      )}

      {/* ── Vista oculta para medir altura ─────────── */}
      <View
        pointerEvents="none"
        onLayout={(e) => { measuredHeight.current = e.nativeEvent.layout.height; }}
        style={styles.measureHidden}
      >
        <View style={styles.detailWrap}>
          <DetailCart manufacturer={manufacturer} onRemoveManufacturer={onRemoveManufacturer} />
        </View>
      </View>

      {/* ── Contenido animado ───────────────────────── */}
      <Animated.View style={animatedContent}>
        <View style={styles.detailWrap}>
          <DetailCart manufacturer={manufacturer} onRemoveManufacturer={onRemoveManufacturer} />
        </View>
      </Animated.View>

      {/* ── Acciones ───────────────────────────────── */}
      <View style={styles.actions}>
        <Pressable
          onPress={() => onRemoveManufacturer?.(manufacturer.manufacturerId)}
          android_ripple={{ color: '#fee2e2' }}
          style={({ pressed }) => [styles.deleteBtn, pressed && styles.deleteBtnPressed]}
        >
          <View style={styles.deleteBtnInner}>
            <Ionicons name="trash-outline" size={14} color={Colors.general.error} />
            <Text style={styles.deleteBtnText}>Eliminar</Text>
          </View>
        </Pressable>

        <View style={styles.orderBtnWrap}>
          <Pressable
            onPress={() => onCreateOrder?.(manufacturer)}
            disabled={hasMinPurchase && !meetsMinPurchase}
            android_ripple={{ color: '#0a2a6e' }}
            style={[styles.orderBtn, hasMinPurchase && !meetsMinPurchase && styles.orderBtnDisabled]}
          >
            <View style={styles.orderBtnInner}>
              <Text style={styles.orderBtnText}>Enviar pedido</Text>
              <Ionicons name="arrow-forward" size={15} color="#fff" />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  headerPressed: {
    backgroundColor: '#f0f2f5',
  },

  // ── Header ──────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 10,
    gap: 10,
  },
  manufacturerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  logoWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.gray.light,
    flexShrink: 0,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  manufacturerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  headerMeta: {
    fontSize: 11,
    color: Colors.gray.semiDark,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  chevronRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  expandHint: {
    fontSize: 10,
    color: Colors.blue.dark,
    fontWeight: '500',
    opacity: 0.7,
  },
  subtotal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.blue.dark,
  },

  // ── Compra mínima ─────────────────────
  minSection: {
    paddingHorizontal: 6,
    paddingBottom: 10,
    gap: 5,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.orange.dark,
    borderRadius: 2,
  },
  progressFillMet: {
    backgroundColor: Colors.general.success,
  },
  minRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  minMetText: {
    fontSize: 11,
    color: Colors.general.success,
    fontWeight: '500',
  },
  minPendingText: {
    fontSize: 11,
    color: Colors.gray.semiDark,
  },
  minPendingAmount: {
    fontWeight: '700',
    color: Colors.orange.dark,
  },

  // ── Divider ──────────────────────────
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },

  // ── Measure hidden ───────────────────
  measureHidden: {
    position: 'absolute',
    opacity: 0,
  },

  // ── Detail ───────────────────────────
  detailWrap: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },

  // ── Actions ──────────────────────────
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 6,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  deleteBtn: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fca5a5',
    overflow: 'hidden',
  },
  deleteBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  deleteBtnPressed: {
    backgroundColor: '#fee2e2',
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.general.error,
  },
  orderBtnWrap: {
    flex: 1,
  },
  orderBtn: {
    borderRadius: 6,
    overflow: 'hidden',
    width: '100%',
  },
  orderBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: Colors.blue.dark,
    borderRadius: 6,
  },
  orderBtnDisabled: {
    opacity: 0.45,
  },
  orderBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});

export default ManufacturerCart;
