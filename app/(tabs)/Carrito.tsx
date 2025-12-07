import { Text, View, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/hooks/useCart';
import { Colors } from '@/constants/Colors';
import { spacing, borderRadius, shadows } from '@/constants/Styles';
import type { CartManufacturerDisplay } from '@/types/cart';

const CartScreen = () => {
  const { cartData, fetchCartData, isEmpty, addToCart } = useCart();
  const [expandedManufacturers, setExpandedManufacturers] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!isEmpty) {
      fetchCartData()
        .then((data) => {
          console.log('🛒 Cart Data:', JSON.stringify(data, null, 2));
        })
        .catch((error) => {
          console.error('❌ Error fetching cart:', error);
        });
    } else {
      console.log('🛒 Cart is empty');
    }
  }, [isEmpty]);

  // Función para agregar un item de prueba al carrito
  const handleAddTestItem = () => {
    addToCart({
      manufacturerId: 1,
      productId: 'test-product-1',
      inventoryId: 1,
      quantity: 1
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const toggleManufacturerExpanded = (manufacturerId: number) => {
    setExpandedManufacturers(prev => ({
      ...prev,
      [manufacturerId]: !prev[manufacturerId]
    }));
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
    const isExpanded = expandedManufacturers[manufacturer.manufacturerId];
    
    return (
      <View key={manufacturer.manufacturerId} style={styles.manufacturerCard}>
        {/* Header del fabricante */}
        <View style={styles.manufacturerHeader}>
          <View style={styles.manufacturerInfo}>
            <View style={styles.manufacturerLogoContainer}>
              {manufacturer.manufacturerLogo && manufacturer.manufacturerLogo !== 'undefined' ? (
                <Image 
                  source={{ uri: manufacturer.manufacturerLogo }} 
                  style={styles.manufacturerLogo}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.manufacturerLogoPlaceholder}>
                  <Ionicons name="storefront-outline" size={20} color={Colors.gray.default} />
                </View>
              )}
            </View>
            <View style={styles.manufacturerDetails}>
              <Text style={styles.manufacturerName}>{manufacturer.manufacturerName}</Text>
              <Text style={styles.manufacturerStats}>
                {manufacturer.totalItems} {manufacturer.totalItems === 1 ? 'producto' : 'productos'} • {formatPrice(manufacturer.subtotal)}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => toggleManufacturerExpanded(manufacturer.manufacturerId)}
            style={styles.expandButton}
          >
            <Ionicons 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={Colors.blue.default} 
            />
          </TouchableOpacity>
        </View>

        {/* Acciones del fabricante */}
        <View style={styles.manufacturerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="trash-outline" size={16} color={Colors.general.error} />
            <Text style={styles.actionButtonTextDanger}>Eliminar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="eye-outline" size={16} color={Colors.blue.default} />
            <Text style={styles.actionButtonText}>Ver detalle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.primaryActionButton]}>
            <Ionicons name="send-outline" size={16} color="white" />
            <Text style={styles.primaryActionButtonText}>Enviar pedido</Text>
          </TouchableOpacity>
        </View>

        {/* Detalle expandible (placeholder para futura implementación) */}
        {isExpanded && (
          <View style={styles.manufacturerDetail}>
            <Text style={styles.detailPlaceholder}>
              Aquí se mostrará el detalle de los productos ({manufacturer.items.length} items)
            </Text>
          </View>
        )}
      </View>
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
    <View style={styles.cartSummary}>
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>Resumen del pedido</Text>
        <Text style={styles.summaryTotal}>{formatPrice(calculateGrandTotal())}</Text>
      </View>
      
      <Text style={styles.summarySubtitle}>
        {getTotalItems()} {getTotalItems() === 1 ? 'producto' : 'productos'} de {cartData.length} {cartData.length === 1 ? 'fabricante' : 'fabricantes'}
      </Text>

      <View style={styles.summaryActions}>
        <TouchableOpacity style={styles.unifyOrderButton}>
          <Ionicons name="package-outline" size={20} color="white" />
          <Text style={styles.unifyOrderButtonText}>Unificar pedido</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.clearCartButton}>
          <Ionicons name="trash-outline" size={18} color={Colors.general.error} />
          <Text style={styles.clearCartButtonText}>Vaciar carrito</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.unifyDescription}>
        Unifica el pedido para que todas tus compras se agrupen en un único envío.
      </Text>
    </View>
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
  manufacturerCard: {
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  manufacturerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  manufacturerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  manufacturerLogoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
    backgroundColor: Colors.gray.light,
    overflow: 'hidden',
  },
  manufacturerLogo: {
    width: '100%',
    height: '100%',
  },
  manufacturerLogoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray.light,
  },
  manufacturerDetails: {
    flex: 1,
  },
  manufacturerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  manufacturerStats: {
    fontSize: 14,
    color: Colors.gray.semiDark,
  },
  expandButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  manufacturerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gray.default,
    backgroundColor: 'white',
    gap: 4,
  },
  primaryActionButton: {
    backgroundColor: Colors.blue.default,
    borderColor: Colors.blue.default,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.blue.default,
  },
  actionButtonTextDanger: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.general.error,
  },
  primaryActionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  manufacturerDetail: {
    marginTop: spacing.sm,
    padding: spacing.md,
    backgroundColor: Colors.gray.light,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  detailPlaceholder: {
    fontSize: 14,
    color: Colors.gray.semiDark,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  cartSummary: {
    backgroundColor: 'white',
    margin: spacing.md,
    marginTop: 0,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.lg,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  summaryTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.blue.default,
  },
  summarySubtitle: {
    fontSize: 14,
    color: Colors.gray.semiDark,
    marginBottom: spacing.lg,
  },
  summaryActions: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  unifyOrderButton: {
    backgroundColor: Colors.orange.default,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.md,
  },
  unifyOrderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  clearCartButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.general.error,
    gap: spacing.sm,
  },
  clearCartButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.general.error,
  },
  unifyDescription: {
    fontSize: 12,
    color: Colors.gray.semiDark,
    textAlign: 'center',
    lineHeight: 16,
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
    borderRadius: borderRadius.lg,
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