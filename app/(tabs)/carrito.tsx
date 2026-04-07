import { Text, View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useMemo, useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCart } from '@/hooks/useCart';
import { Colors } from '@/constants/Colors';
import { spacing, shadows } from '@/constants/Styles';
import ManufacturerCart from '@/components/cart/ManufacturerCart';
import UnifyOrder from '@/components/cart/UnifyOrder';
import OrderConfirmationModal from '@/components/cart/OrderConfirmationModal';
import type { CartManufacturerDisplay } from '@/types/cart';

const CartScreen = () => {
  const { cartData, fetchCartData, isEmpty, removeManufacturer, clearCart } = useCart();

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderType, setOrderType] = useState<'single' | 'unified'>('single');
  const [selectedManufacturer, setSelectedManufacturer] = useState<CartManufacturerDisplay | undefined>();

  useFocusEffect(
    useCallback(() => {
      if (!isEmpty) {
        fetchCartData().catch((error) => {
          console.error('❌ Error fetching cart:', error);
        });
      }
    }, [isEmpty])
  );

  const handleCreateSingleOrder = (manufacturer: CartManufacturerDisplay) => {
    setSelectedManufacturer(manufacturer);
    setOrderType('single');
    setShowOrderModal(true);
  };

  const handleCreateUnifiedOrder = () => {
    setSelectedManufacturer(undefined);
    setOrderType('unified');
    setShowOrderModal(true);
  };

  const handleOrderCreated = () => {
    fetchCartData().catch((error) => {
      console.error('❌ Error refreshing cart after order:', error);
    });
  };

  const grandTotal = useMemo(() => {
    if (!cartData || cartData.length === 0) return 0;
    return cartData.reduce((total, m) => total + m.subtotal, 0);
  }, [cartData]);

  const totalItems = useMemo(() => {
    if (!cartData || cartData.length === 0) return 0;
    return cartData.reduce((total, m) => total + m.totalItems, 0);
  }, [cartData]);

  return (
    <View style={styles.container}>

      {/* ── Header ──────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Tu carrito</Text>
          {!isEmpty && cartData.length > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>
                {cartData.length} {cartData.length === 1 ? 'fabricante' : 'fabricantes'}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* ── Estado vacío ────────────────────────── */}
      {isEmpty ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="basket-outline" size={52} color={Colors.blue.dark} />
          </View>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySubtitle}>
            Explorá los productos de nuestros fabricantes y empezá a armar tu pedido.
          </Text>
          <Pressable
            onPress={() => router.push('/(tabs)/tienda')}
            android_ripple={{ color: '#d95f10' }}
            style={({ pressed }) => [styles.goShoppingBtn, pressed && styles.goShoppingBtnPressed]}
          >
            <Text style={styles.goShoppingText}>Ir a la tienda</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </Pressable>
        </View>
      ) : (
        <>
          {/* ── Lista de fabricantes ─────────────── */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {cartData.map((manufacturer) => (
              <ManufacturerCart
                key={manufacturer.manufacturerId}
                manufacturer={manufacturer}
                onRemoveManufacturer={removeManufacturer}
                onCreateOrder={handleCreateSingleOrder}
              />
            ))}
          </ScrollView>

          {/* ── Panel inferior fijo ──────────────── */}
          <UnifyOrder
            totalAmount={grandTotal}
            totalItems={totalItems}
            manufacturersCount={cartData.length}
            onClearCart={clearCart}
            onUnifyOrder={handleCreateUnifiedOrder}
          />
        </>
      )}

      <OrderConfirmationModal
        visible={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        orderType={orderType}
        cartData={cartData}
        selectedManufacturer={selectedManufacturer}
        onOrderCreated={handleOrderCreated}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray.light,
  },

  // ── Header ──────────────────────────────
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.blue.dark,
  },
  headerBadge: {
    backgroundColor: Colors.blue.dark + '12',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.blue.dark,
  },

  // ── Scroll ───────────────────────────────
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 6,
    paddingBottom: spacing.lg,
    gap: 6,
  },

  // ── Empty state ──────────────────────────
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    gap: 12,
  },
  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.blue.dark + '0F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.gray.semiDark,
    textAlign: 'center',
    lineHeight: 20,
  },
  goShoppingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.orange.dark,
    paddingVertical: 13,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 8,
  },
  goShoppingBtnPressed: {
    backgroundColor: '#d95f10',
  },
  goShoppingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});

export default CartScreen;
