import { Text, View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/hooks/useCart';
import { useAppSelector } from '@/hooks/redux';
import { Colors } from '@/constants/Colors';
import { spacing, shadows } from '@/constants/Styles';
import ManufacturerCart from '@/components/cart/ManufacturerCart';
import UnifyOrder from '@/components/cart/UnifyOrder';
import OrderConfirmationModal from '@/components/cart/OrderConfirmationModal';
import type { CartManufacturerDisplay } from '@/types/cart';

const CartScreen = () => {
  const { cartData, fetchCartData, isEmpty, addToCart, removeManufacturer, clearCart, lastUpdated } = useCart();
  const { user: myUser } = useAppSelector(state => state.user);
  
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderType, setOrderType] = useState<'single' | 'unified'>('single');
  const [selectedManufacturer, setSelectedManufacturer] = useState<CartManufacturerDisplay | undefined>();

  // Usar useFocusEffect para recargar datos cada vez que la pantalla recibe foco O cuando cambie el carrito
  useFocusEffect(
    useCallback(() => {
      if (!isEmpty) {
        fetchCartData()
          .then((data) => {
            // console.log('🛒 Cart Data:', JSON.stringify(data, null, 2));
          })
          .catch((error) => {
            console.error('❌ Error fetching cart:', error);
          });
      } else {
        console.log('🛒 Cart is empty');
      }
    }, [isEmpty, lastUpdated])
  );

  // Función para agregar un item de prueba al carrito
  const handleAddTestItem = () => {
    addToCart({
      manufacturerId: 1,
      productId: 'test-product-1',
      inventoryId: 1,
      quantity: 1
    });
  };

  // Función para eliminar un fabricante específico del carrito
  const handleRemoveManufacturer = (manufacturerId: number) => {
    removeManufacturer(manufacturerId);
  };

  // Función para limpiar todo el carrito
  const handleClearCart = () => {
    clearCart();
  };

  // Función para crear pedido individual por fabricante
  const handleCreateSingleOrder = (manufacturer: CartManufacturerDisplay) => {
    setSelectedManufacturer(manufacturer);
    setOrderType('single');
    setShowOrderModal(true);
  };

  // Función para crear pedido unificado
  const handleCreateUnifiedOrder = () => {
    setSelectedManufacturer(undefined);
    setOrderType('unified');
    setShowOrderModal(true);
  };

  // Función para manejar cuando se crea exitosamente una orden
  const handleOrderCreated = () => {
    // Opcional: limpiar el carrito después de crear la orden
    // clearCart();
    
    // Opcional: refrescar datos del carrito
    fetchCartData();
  };



  const calculateGrandTotal = () => {
    if (!cartData || cartData.length === 0) return 0;
    return cartData.reduce((total, manufacturer) => total + manufacturer.subtotal, 0);
  };

  const getTotalItems = () => {
    if (!cartData || cartData.length === 0) return 0;
    return cartData.reduce((total, manufacturer) => total + manufacturer.totalItems, 0);
  };

  const renderManufacturerCard = (manufacturer: CartManufacturerDisplay) => {
    return (
      <ManufacturerCart 
        key={manufacturer.manufacturerId} 
        manufacturer={manufacturer}
        onRemoveManufacturer={handleRemoveManufacturer}
        onCreateOrder={handleCreateSingleOrder}
      />
    );
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <View style={styles.emptyCartIconContainer}>
        <Ionicons name="basket-outline" size={64} color={Colors.gray.default} />
      </View>
      <Text style={styles.emptyCartTitle}>Tu carrito está vacío</Text>
      <Text style={styles.emptyCartSubtitle}>Descubrí los mejores productos de nuestros fabricantes</Text>
      
      <TouchableOpacity 
        onPress={handleAddTestItem}
        style={styles.testButton}
      >
        <Text style={styles.testButtonText}>
          Agregar item de prueba al carrito
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCartSummary = () => (
    <UnifyOrder 
      totalAmount={calculateGrandTotal()}
      totalItems={getTotalItems()}
      manufacturersCount={cartData.length}
      onClearCart={handleClearCart}
      onUnifyOrder={handleCreateUnifiedOrder}
    />
  );

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
        renderEmptyCart()
      ) : (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Lista de fabricantes */}
          <View style={styles.manufacturersList}>
            {cartData.map(renderManufacturerCard)}
          </View>

          {/* Resumen del carrito */}
          {renderCartSummary()}
        </ScrollView>
      )}
      
      {/* Modal de confirmación de orden */}
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
}

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
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  testButton: {
    backgroundColor: Colors.blue.default,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    ...shadows.md,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});


export default CartScreen;