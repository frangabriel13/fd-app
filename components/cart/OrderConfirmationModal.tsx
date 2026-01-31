import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { createOrder, clearCreatedOrder, type CreateOrderPayload } from '@/store/slices/orderSlice';
import { Colors } from '@/constants/Colors';
import { spacing, borderRadius, shadows } from '@/constants/Styles';
import type { CartManufacturerDisplay } from '@/types/cart';

interface OrderConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  orderType: 'single' | 'unified';
  cartData: CartManufacturerDisplay[];
  selectedManufacturer?: CartManufacturerDisplay;
  onOrderCreated?: () => void;
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  visible,
  onClose,
  orderType,
  cartData,
  selectedManufacturer,
  onOrderCreated
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { user: myUser } = useAppSelector(state => state.user);
  const { loadingCreateOrder, errorCreateOrder, createdOrder } = useAppSelector(state => state.order);

  // Verificar si el usuario es wholesaler
  const isWholesaler = myUser?.role === 'wholesaler';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const transformCartToOrderFormat = (manufacturers: CartManufacturerDisplay[]): CreateOrderPayload => {
    return {
      carts: manufacturers.map(manufacturer => ({
        manufacturer: {
          userId: manufacturer.manufacturerId,
          id: manufacturer.manufacturerId,
          name: manufacturer.manufacturerName || 'Fabricante desconocido'
        },
        products: manufacturer.items.map(item => ({
          id: item.productId,
          name: item.productName || 'Producto',
          price: item.price || 0,
          inventories: [{
            color: item.color || 'Sin especificar',
            size: item.size || 'Sin especificar',
            totalItem: item.quantity
          }]
        })),
        packs: [], // Si tienes lógica de packs, agrégala aquí
        totalCart: manufacturer.subtotal
      }))
    };
  };

  const handleCreateOrder = async () => {
    if (!isWholesaler) {
      Alert.alert(
        'Acceso restringido',
        'Debes tener una cuenta de mayorista para realizar pedidos.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    const manufacturersToProcess = orderType === 'single' && selectedManufacturer 
      ? [selectedManufacturer] 
      : cartData;

    const orderData = transformCartToOrderFormat(manufacturersToProcess);

    try {
      const result = await dispatch(createOrder(orderData));
      
      if (createOrder.fulfilled.match(result)) {
        Alert.alert(
          'Pedido creado exitosamente',
          `Tu pedido #${result.payload.id} ha sido creado por un total de ${formatPrice(result.payload.total)}`,
          [
            {
              text: 'OK',
              onPress: () => {
                onClose();
                onOrderCreated?.();
                dispatch(clearCreatedOrder());
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const getOrderSummary = () => {
    const manufacturersToProcess = orderType === 'single' && selectedManufacturer 
      ? [selectedManufacturer] 
      : cartData;

    const totalAmount = manufacturersToProcess.reduce((total, manufacturer) => total + manufacturer.subtotal, 0);
    const totalItems = manufacturersToProcess.reduce((total, manufacturer) => total + manufacturer.totalItems, 0);

    return {
      manufacturersCount: manufacturersToProcess.length,
      totalAmount,
      totalItems
    };
  };

  const { manufacturersCount, totalAmount, totalItems } = getOrderSummary();

  if (!isWholesaler) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="warning" size={24} color={Colors.general.error} />
              <Text style={styles.modalTitle}>Acceso restringido</Text>
            </View>
            
            <Text style={styles.modalMessage}>
              Para realizar pedidos necesitas tener una cuenta de mayorista verificada.
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Ionicons name="bag-check" size={24} color={Colors.orange.default} />
            <Text style={styles.modalTitle}>
              {orderType === 'single' ? 'Confirmar pedido' : 'Confirmar pedido unificado'}
            </Text>
          </View>
          
          <View style={styles.orderSummary}>
            <Text style={styles.summaryText}>
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'} de {manufacturersCount} {manufacturersCount === 1 ? 'fabricante' : 'fabricantes'}
            </Text>
            <Text style={styles.totalAmount}>{formatPrice(totalAmount)}</Text>
          </View>

          {orderType === 'unified' && (
            <Text style={styles.unifiedNote}>
              Este pedido unificará las compras de todos los fabricantes en tu carrito.
            </Text>
          )}

          {errorCreateOrder && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorCreateOrder}</Text>
            </View>
          )}
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onClose}
              disabled={loadingCreateOrder}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.confirmButton, loadingCreateOrder && styles.disabledButton]} 
              onPress={handleCreateOrder}
              disabled={loadingCreateOrder}
            >
              {loadingCreateOrder ? (
                <Text style={styles.confirmButtonText}>Creando...</Text>
              ) : (
                <Text style={styles.confirmButtonText}>Confirmar pedido</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    flex: 1,
  },
  orderSummary: {
    backgroundColor: Colors.gray.light,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.gray.semiDark,
    marginBottom: spacing.sm,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.blue.default,
  },
  unifiedNote: {
    fontSize: 12,
    color: Colors.gray.semiDark,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  modalMessage: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  errorContainer: {
    backgroundColor: Colors.general.error + '20',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: 14,
    color: Colors.general.error,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray.semiDark,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray.semiDark,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: Colors.orange.default,
    alignItems: 'center',
    ...shadows.md,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  closeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: Colors.blue.default,
    alignItems: 'center',
    ...shadows.md,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default OrderConfirmationModal;