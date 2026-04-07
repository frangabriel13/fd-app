import { Text, View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/hooks/useCart';
import { Colors } from '@/constants/Colors';
import { spacing, shadows } from '@/constants/Styles';
import ManufacturerCart from '@/components/cart/ManufacturerCart';
import UnifyOrder from '@/components/cart/UnifyOrder';
import OrderConfirmationModal from '@/components/cart/OrderConfirmationModal';
import type { CartManufacturerDisplay } from '@/types/cart';
import { useState } from 'react';

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
    return cartData.reduce((total, manufacturer) => total + manufacturer.subtotal, 0);
  }, [cartData]);

  const totalItems = useMemo(() => {
    if (!cartData || cartData.length === 0) return 0;
    return cartData.reduce((total, manufacturer) => total + manufacturer.totalItems, 0);
  }, [cartData]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tu carrito</Text>
        {!isEmpty && (
          <Text style={styles.subtitle}>
            {cartData.length} {cartData.length === 1 ? 'fabricante' : 'fabricantes'}
          </Text>
        )}
      </View>

      {isEmpty ? (
        <View style={styles.emptyCartContainer}>
          <View style={styles.emptyCartIconContainer}>
            <Ionicons name="basket-outline" size={64} color={Colors.gray.default} />
          </View>
          <Text style={styles.emptyCartTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptyCartSubtitle}>
            Descubrí los mejores productos de nuestros fabricantes
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.manufacturersList}>
            {cartData.map((manufacturer) => (
              <ManufacturerCart
                key={manufacturer.manufacturerId}
                manufacturer={manufacturer}
                onRemoveManufacturer={removeManufacturer}
                onCreateOrder={handleCreateSingleOrder}
              />
            ))}
          </View>

          <UnifyOrder
            totalAmount={grandTotal}
            totalItems={totalItems}
            manufacturersCount={cartData.length}
            onClearCart={clearCart}
            onUnifyOrder={handleCreateUnifiedOrder}
          />
        </ScrollView>
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
  header: {
    backgroundColor: 'white',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    ...shadows.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray.semiDark,
  },
  scrollContainer: {
    flex: 1,
  },
  manufacturersList: {
    padding: spacing.md,
    gap: spacing.md,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyCartIconContainer: {
    marginBottom: spacing.lg,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyCartSubtitle: {
    fontSize: 16,
    color: Colors.gray.semiDark,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default CartScreen;
