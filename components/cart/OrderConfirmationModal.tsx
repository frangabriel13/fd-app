import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { createOrder, clearCreatedOrder, type CreateOrderPayload } from '@/store/slices/orderSlice';
import { removeManufacturer, clearCart } from '@/store/slices/cartSlice';
import { Colors } from '@/constants/Colors';
import { shadows } from '@/constants/Styles';
import { formatPrice } from '@/utils/formatPrice';
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
  onOrderCreated,
}) => {
  const dispatch = useAppDispatch();
  const { user: myUser } = useAppSelector(state => state.user);
  const { loadingCreateOrder, errorCreateOrder } = useAppSelector(state => state.order);
  const [successData, setSuccessData] = useState<{ id: number; total: number } | null>(null);

  const isWholesaler = myUser?.role === 'wholesaler';

  const manufacturersToProcess =
    orderType === 'single' && selectedManufacturer ? [selectedManufacturer] : cartData;

  const totalAmount = manufacturersToProcess.reduce((s, m) => s + m.subtotal, 0);
  const totalItems  = manufacturersToProcess.reduce((s, m) => s + m.totalItems, 0);

  // Limpiar estado de éxito al cerrar externamente
  useEffect(() => {
    if (!visible) setSuccessData(null);
  }, [visible]);

  const buildOrderPayload = (manufacturers: CartManufacturerDisplay[]): CreateOrderPayload => ({
    carts: manufacturers.map(m => {
      // Agrupar variaciones por productId
      const productsMap = new Map<string, typeof m.items>();
      m.items.forEach(item => {
        if (!productsMap.has(item.productId)) productsMap.set(item.productId, []);
        productsMap.get(item.productId)!.push(item);
      });

      return {
        manufacturer: {
          userId: m.manufacturerUserId || m.manufacturerId,
        },
        products: Array.from(productsMap.entries()).map(([productId, variations]) => ({
          id: productId,
          name: variations[0].productName || 'Producto',
          price: variations[0].price || 0,
          inventories: variations.map(v => ({
            color: v.color || 'Sin especificar',
            size: v.size || 'Sin especificar',
            totalItem: v.quantity,
          })),
        })),
        packs: [],
        totalCart: m.subtotal,
      };
    }),
  });

  const handleConfirm = async () => {
    const result = await dispatch(createOrder(buildOrderPayload(manufacturersToProcess)));

    if (createOrder.fulfilled.match(result)) {
      if (orderType === 'unified') {
        dispatch(clearCart());
      } else if (selectedManufacturer) {
        dispatch(removeManufacturer({ manufacturerId: selectedManufacturer.manufacturerId }));
      }
      setSuccessData({ id: result.payload.id, total: result.payload.total });
    }
  };

  const handleClose = () => {
    if (successData) {
      dispatch(clearCreatedOrder());
      setSuccessData(null);
      onOrderCreated?.();
    }
    onClose();
  };

  const renderManufacturerRow = (mfr: CartManufacturerDisplay) => {
    const uniqueProducts = new Set(mfr.items.map(i => i.productId)).size;
    return (
      <View key={mfr.manufacturerId} style={styles.mfrRow}>
        {mfr.manufacturerLogo && mfr.manufacturerLogo !== 'undefined' ? (
          <Image source={{ uri: mfr.manufacturerLogo }} style={styles.mfrLogo} />
        ) : (
          <View style={[styles.mfrLogo, styles.mfrLogoFallback]}>
            <Ionicons name="storefront-outline" size={14} color={Colors.gray.semiDark} />
          </View>
        )}
        <View style={styles.mfrInfo}>
          <Text style={styles.mfrName} numberOfLines={1}>
            {mfr.manufacturerName ?? 'Fabricante'}
          </Text>
          <Text style={styles.mfrMeta}>
            {mfr.totalItems} {mfr.totalItems === 1 ? 'unidad' : 'unidades'} ·{' '}
            {uniqueProducts} {uniqueProducts === 1 ? 'producto' : 'productos'}
          </Text>
        </View>
        <Text style={styles.mfrSubtotal}>{formatPrice(mfr.subtotal)}</Text>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <View style={styles.sheet}>
          {/* Barra decorativa */}
          <View style={styles.handle} />

          {/* ── Estado: éxito ────────────────────── */}
          {successData ? (
            <View style={styles.centeredContainer}>
              <View style={styles.successIconWrap}>
                <Ionicons name="checkmark" size={38} color="#fff" />
              </View>
              <Text style={styles.centeredTitle}>¡Pedido enviado!</Text>
              <Text style={styles.successOrderId}>Pedido #{successData.id}</Text>
              <Text style={styles.successTotal}>{formatPrice(successData.total)}</Text>
              <Text style={styles.centeredNote}>
                El fabricante recibirá tu pedido y se pondrá en contacto con vos pronto.
              </Text>
              <Pressable
                style={styles.primaryBtn}
                onPress={handleClose}
                android_ripple={{ color: '#0a2a6e' }}
              >
                <View style={styles.primaryBtnInner}>
                  <Text style={styles.primaryBtnText}>Continuar comprando</Text>
                </View>
              </Pressable>
            </View>

          /* ── Estado: acceso restringido ──────── */
          ) : !isWholesaler ? (
            <View style={styles.centeredContainer}>
              <View style={styles.lockIconWrap}>
                <Ionicons name="lock-closed-outline" size={30} color={Colors.blue.dark} />
              </View>
              <Text style={styles.centeredTitle}>Solo para mayoristas</Text>
              <Text style={styles.centeredNote}>
                Para realizar pedidos necesitás tener una cuenta de mayorista verificada.
              </Text>
              <Pressable style={styles.outlineBtn} onPress={handleClose}>
                <Text style={styles.outlineBtnText}>Entendido</Text>
              </Pressable>
            </View>

          /* ── Estado: confirmación ────────────── */
          ) : (
            <>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>
                  {orderType === 'unified' ? 'Pedido unificado' : 'Confirmar pedido'}
                </Text>
                <Pressable style={styles.closeBtn} onPress={handleClose} hitSlop={10}>
                  <Ionicons name="close" size={20} color={Colors.gray.semiDark} />
                </Pressable>
              </View>

              {/* Lista de fabricantes */}
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {manufacturersToProcess.map(renderManufacturerRow)}
              </ScrollView>

              {/* Total */}
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <View>
                  <Text style={styles.totalLabel}>Total del pedido</Text>
                  <Text style={styles.totalMeta}>
                    {totalItems} {totalItems === 1 ? 'unidad' : 'unidades'}
                    {manufacturersToProcess.length > 1 &&
                      ` · ${manufacturersToProcess.length} fabricantes`}
                  </Text>
                </View>
                <Text style={styles.totalAmount}>{formatPrice(totalAmount)}</Text>
              </View>

              {/* Error inline */}
              {errorCreateOrder && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle-outline" size={15} color={Colors.general.error} />
                  <Text style={styles.errorText}>{errorCreateOrder}</Text>
                </View>
              )}

              {/* CTA */}
              <Pressable
                style={({ pressed }) => [
                  styles.primaryBtn,
                  (loadingCreateOrder || pressed) && styles.primaryBtnPressed,
                ]}
                onPress={handleConfirm}
                disabled={loadingCreateOrder}
                android_ripple={{ color: '#0a2a6e' }}
              >
                <View style={styles.primaryBtnInner}>
                  {loadingCreateOrder ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons name="bag-check-outline" size={19} color="#fff" />
                      <Text style={styles.primaryBtnText}>Confirmar pedido</Text>
                    </>
                  )}
                </View>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 28,
    ...shadows.lg,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },

  // ── Header ──────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray.light,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Lista de fabricantes ─────────────────
  scroll: {
    maxHeight: 240,
  },
  scrollContent: {
    paddingVertical: 6,
  },
  mfrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  mfrLogo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    flexShrink: 0,
  },
  mfrLogoFallback: {
    backgroundColor: Colors.gray.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mfrInfo: {
    flex: 1,
    gap: 3,
  },
  mfrName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  mfrMeta: {
    fontSize: 12,
    color: Colors.gray.semiDark,
  },
  mfrSubtotal: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.blue.dark,
  },

  // ── Total ────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray.semiDark,
  },
  totalMeta: {
    fontSize: 12,
    color: Colors.gray.default,
    marginTop: 2,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.blue.dark,
  },

  // ── Error ────────────────────────────────
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.general.error + '12',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: Colors.general.error,
  },

  // ── Botones ──────────────────────────────
  primaryBtn: {
    borderRadius: 6,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  primaryBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.blue.dark,
    paddingVertical: 15,
    minHeight: 50,
    borderRadius: 6,
  },
  primaryBtnPressed: {
    backgroundColor: '#0a2a6e',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  outlineBtn: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: Colors.blue.dark,
    paddingVertical: 13,
    borderRadius: 6,
    alignItems: 'center',
  },
  outlineBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.blue.dark,
  },

  // ── Estados centrados (éxito / restringido) ──
  centeredContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 8,
    gap: 10,
  },
  centeredTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
  },
  centeredNote: {
    fontSize: 13,
    color: Colors.gray.semiDark,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 12,
    marginBottom: 8,
  },

  // Éxito
  successIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.general.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successOrderId: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.gray.semiDark,
  },
  successTotal: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.blue.dark,
  },

  // Restringido
  lockIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.blue.dark + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OrderConfirmationModal;
