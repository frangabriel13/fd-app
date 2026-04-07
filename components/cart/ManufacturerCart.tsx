import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
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

  // Productos únicos para thumbnail strip (deduplicados por productId)
  const uniqueProducts = manufacturer.items
    .reduce<typeof manufacturer.items>((acc, item) => {
      if (!acc.find(p => p.productId === item.productId)) acc.push(item);
      return acc;
    }, [])
    .slice(0, 4);

  const uniqueProductCount = manufacturer.items.reduce<string[]>((acc, item) => {
    if (!acc.includes(item.productId)) acc.push(item.productId);
    return acc;
  }, []).length;

  const hasMinPurchase = !!manufacturer.minPurchase && manufacturer.minPurchase > 0;
  const meetsMinPurchase = !hasMinPurchase || manufacturer.subtotal >= manufacturer.minPurchase!;
  const remaining = hasMinPurchase ? manufacturer.minPurchase! - manufacturer.subtotal : 0;

  return (
    <View style={styles.card}>

      {/* ── Header (tap para expandir) ─────────────── */}
      <Pressable
        onPress={toggle}
        android_ripple={{ color: '#f3f4f6' }}
        style={({ pressed }) => pressed && styles.headerPressed}
      >
        <View style={styles.header}>
          {/* Logo */}
          <View style={styles.logoWrap}>
            {manufacturer.manufacturerLogo && manufacturer.manufacturerLogo !== 'undefined' ? (
              <Image
                source={{ uri: manufacturer.manufacturerLogo }}
                style={styles.logo}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Ionicons name="storefront-outline" size={18} color={Colors.gray.semiDark} />
              </View>
            )}
          </View>

          {/* Nombre + meta */}
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

          {/* Subtotal + chevron */}
          <View style={styles.headerRight}>
            <Text style={styles.subtotal}>{formatPrice(manufacturer.subtotal)}</Text>
            <Animated.View style={animatedChevron}>
              <Ionicons name="chevron-down" size={16} color={Colors.gray.semiDark} />
            </Animated.View>
          </View>
        </View>
      </Pressable>

      {/* ── Alerta compra mínima ────────────────────── */}
      {hasMinPurchase && !meetsMinPurchase && (
        <View style={styles.minPurchaseAlert}>
          <Ionicons name="alert-circle-outline" size={14} color="#92400e" />
          <Text style={styles.minPurchaseText}>
            Mínimo {formatPrice(manufacturer.minPurchase!)} · Te faltan {formatPrice(remaining)}
          </Text>
        </View>
      )}
      {hasMinPurchase && meetsMinPurchase && (
        <View style={styles.minPurchaseOk}>
          <Ionicons name="checkmark-circle-outline" size={14} color="#166534" />
          <Text style={styles.minPurchaseOkText}>Mínimo de compra alcanzado</Text>
        </View>
      )}

      {/* ── Thumbnail strip (solo cuando está cerrado) ── */}
      {!isExpanded && uniqueProducts.length > 0 && (
        <View style={styles.thumbnailStrip}>
          {uniqueProducts.map((item) =>
            item.productImage ? (
              <Image
                key={item.productId}
                source={{ uri: item.productImage }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            ) : (
              <View key={item.productId} style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
                <Ionicons name="image-outline" size={14} color={Colors.gray.default} />
              </View>
            )
          )}
          {uniqueProductCount > 4 && (
            <View style={[styles.thumbnail, styles.thumbnailMore]}>
              <Text style={styles.thumbnailMoreText}>+{uniqueProductCount - 4}</Text>
            </View>
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
          <Ionicons name="trash-outline" size={15} color={Colors.general.error} />
          <Text style={styles.deleteBtnText}>Eliminar</Text>
        </Pressable>

        <Pressable
          onPress={() => onCreateOrder?.(manufacturer)}
          android_ripple={{ color: '#d95f10' }}
          style={({ pressed }) => [
            styles.orderBtn,
            pressed && styles.orderBtnPressed,
            hasMinPurchase && !meetsMinPurchase && styles.orderBtnDisabled,
          ]}
        >
          <Ionicons name="send-outline" size={15} color="#fff" />
          <Text style={styles.orderBtnText}>Enviar pedido</Text>
        </Pressable>
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
    backgroundColor: '#fafafa',
  },

  // ── Header ──────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 12,
    gap: 10,
  },
  logoWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    gap: 3,
  },
  manufacturerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  headerMeta: {
    fontSize: 12,
    color: Colors.gray.semiDark,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 5,
  },
  subtotal: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.blue.dark,
  },

  // ── Alertas compra mínima ────────────
  minPurchaseAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  minPurchaseText: {
    fontSize: 12,
    color: '#92400e',
    flex: 1,
  },
  minPurchaseOk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  minPurchaseOkText: {
    fontSize: 12,
    color: '#166534',
  },

  // ── Thumbnail strip ──────────────────
  thumbnailStrip: {
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingBottom: 12,
    gap: 6,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.gray.light,
  },
  thumbnailPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailMore: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e7eb',
  },
  thumbnailMoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.gray.semiDark,
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
    paddingHorizontal: 6,
    paddingVertical: 12,
  },

  // ── Actions ──────────────────────────
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 6,
    paddingBottom: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fca5a5',
    backgroundColor: '#fff',
  },
  deleteBtnPressed: {
    backgroundColor: '#fee2e2',
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.general.error,
  },
  orderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.orange.dark,
  },
  orderBtnPressed: {
    backgroundColor: '#d95f10',
  },
  orderBtnDisabled: {
    opacity: 0.5,
  },
  orderBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});

export default ManufacturerCart;
