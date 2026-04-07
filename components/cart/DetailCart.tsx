import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/hooks/useCart';
import { useCartAnimationContext } from '@/contexts/CartAnimationContext';
import { CartManufacturerDisplay, CartItemDisplay } from '@/types/cart';
import { Colors } from '@/constants/Colors';

interface DetailCartProps {
  manufacturer: CartManufacturerDisplay;
  onRemoveManufacturer?: (manufacturerId: number) => void;
}

interface GroupedProduct {
  productId: string;
  productName?: string;
  productImage?: string;
  price?: number;
  salePrice?: number;
  variations: CartItemDisplay[];
}

const getColorValue = (color?: string) => {
  if (!color) return '#ccc';
  if (color.startsWith('#')) return color;
  if (/^[a-zA-Z]+$/.test(color)) return color;
  if (color.startsWith('rgb') || color.startsWith('hsl')) return color;
  if (/^[0-9A-Fa-f]{6}$/.test(color)) return `#${color}`;
  return '#ccc';
};

const DetailCart = ({ manufacturer, onRemoveManufacturer }: DetailCartProps) => {
  const { updateCartItem, removeFromCart } = useCart();
  const { triggerAnimation } = useCartAnimationContext();

  const groupedProducts: GroupedProduct[] = manufacturer.items.reduce((acc: GroupedProduct[], item) => {
    const existing = acc.find(p => p.productId === item.productId);
    if (existing) {
      existing.variations.push(item);
    } else {
      acc.push({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        price: item.price,
        salePrice: item.salePrice,
        variations: [item],
      });
    }
    return acc;
  }, []);

  const updateQuantity = (item: CartItemDisplay, newQuantity: number) => {
    const validQuantity = Math.max(0, newQuantity);
    if (validQuantity > 0) {
      if (validQuantity > item.quantity) triggerAnimation();
      updateCartItem({
        manufacturerId: item.manufacturerId,
        productId: item.productId,
        inventoryId: item.inventoryId,
        quantity: validQuantity,
      });
    } else {
      removeFromCart({
        manufacturerId: item.manufacturerId,
        productId: item.productId,
        inventoryId: item.inventoryId,
      });
    }
  };

  const renderVariation = (item: CartItemDisplay, isVariable: boolean) => {
    const shouldShowSize = !item.color || item.color.trim() === '' || item.color.toLowerCase() === 'sin color';
    const displayLabel = shouldShowSize ? item.size : item.color;
    const showColorDot = isVariable && !shouldShowSize && item.color;
    const qty = item.quantity;

    return (
      <View key={item.inventoryId} style={styles.variationRow}>
        <View style={styles.variationLeft}>
          {showColorDot && (
            <View style={[styles.colorDot, { backgroundColor: getColorValue(item.color) }]} />
          )}
          <Text style={styles.variationLabel}>{displayLabel || 'N/A'}</Text>
        </View>

        <View style={styles.stepper}>
          <Pressable
            onPress={() => updateQuantity(item, qty - 1)}
            disabled={qty === 0}
            hitSlop={{ top: 9, bottom: 9, left: 9, right: 9 }}
            android_ripple={{ color: '#e5e7eb', borderless: true, radius: 16 }}
            style={({ pressed }) => [styles.stepBtn, pressed && styles.stepBtnPressed, qty === 0 && styles.stepBtnDisabled]}
          >
            <Ionicons name={qty === 1 ? 'trash-outline' : 'remove'} size={15} color={qty === 1 ? Colors.general.error : '#374151'} />
          </Pressable>

          <Text style={styles.stepQty}>{qty}</Text>

          <Pressable
            onPress={() => updateQuantity(item, qty + 1)}
            hitSlop={{ top: 9, bottom: 9, left: 9, right: 9 }}
            android_ripple={{ color: '#e5e7eb', borderless: true, radius: 16 }}
            style={({ pressed }) => [styles.stepBtn, pressed && styles.stepBtnPressed]}
          >
            <Ionicons name="add" size={15} color="#374151" />
          </Pressable>
        </View>
      </View>
    );
  };

  const renderProduct = (product: GroupedProduct, index: number, total: number) => {
    const isVariable = product.variations.some(v => v.color && v.color.trim() !== '');
    const displayPrice = product.variations[0]?.salePrice || product.variations[0]?.price || 0;
    const hasSalePrice = !!product.variations[0]?.salePrice && product.variations[0].salePrice !== product.variations[0].price;

    return (
      <View key={product.productId} style={[styles.product, index < total - 1 && styles.productBorder]}>
        {/* Imagen + nombre + precio */}
        <View style={styles.productHeader}>
          <View style={styles.imageWrap}>
            {product.productImage ? (
              <Image source={{ uri: product.productImage }} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={[styles.image, styles.imagePlaceholder]}>
                <Ionicons name="image-outline" size={20} color={Colors.gray.default} />
              </View>
            )}
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {product.productName || 'Producto sin nombre'}
            </Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>
                ${displayPrice.toLocaleString('es-AR', { minimumFractionDigits: 0 })}
              </Text>
              {hasSalePrice && (
                <Text style={styles.originalPrice}>
                  ${(product.price || 0).toLocaleString('es-AR', { minimumFractionDigits: 0 })}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Variaciones */}
        <View style={styles.variations}>
          {product.variations.map(item => renderVariation(item, isVariable))}
        </View>

      </View>
    );
  };

  return (
    <View style={styles.container}>
      {groupedProducts.map((product, index) => renderProduct(product, index, groupedProducts.length))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},

  // ── Producto ──────────────────────────
  product: {
    paddingHorizontal: 6,
    paddingVertical: 10,
  },
  productBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  productHeader: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    borderRadius: 6,
  },
  imageWrap: {
    width: 64,
    height: 64,
    borderRadius: 6,
    overflow: 'hidden',
    flexShrink: 0,
    backgroundColor: Colors.gray.light,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 4,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.blue.dark,
  },
  originalPrice: {
    fontSize: 12,
    color: Colors.gray.default,
    textDecorationLine: 'line-through',
  },

  // ── Variaciones ───────────────────────
  variations: {
    gap: 2,
    marginLeft: 74,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 6,
    marginTop: 4,
  },
  variationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  variationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  colorDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  variationLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },

  // ── Stepper ───────────────────────────
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.gray.light,
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnPressed: {
    backgroundColor: '#e5e7eb',
  },
  stepBtnDisabled: {
    opacity: 0.4,
  },
  stepQty: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    minWidth: 24,
    textAlign: 'center',
  },
});

export default DetailCart;
