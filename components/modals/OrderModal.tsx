import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, borderRadius, shadows } from '@/constants/Styles';
import { Colors } from '@/constants/Colors';

interface Product {
  id: number;
  name: string;
  price: number;
  inventories: {
    color: string;
    size: string;
    totalItem: number;
  }[];
}

interface Pack {
  id: number;
  name: string;
  price: number;
  totalItem: number;
}

interface SubOrder {
  id: number;
  subtotal: number;
  status: string;
  products: Product[];
  packs: Pack[];
  user: {
    id: number;
    email: string;
    manufacturer?: {
      id: number;
      name: string;
      phone: string;
    };
    wholesaler?: {
      id: number;
      name: string;
      phone: string;
    };
  };
}

interface Order {
  id: number;
  unifique: boolean;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  subOrders: SubOrder[];
}

interface OrderModalProps {
  onClose: () => void;
  order: Order | null;
}

const OrderModal: React.FC<OrderModalProps> = ({ onClose, order }) => {
  if (!order) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsApp = (phone: string, manufacturerName: string, subOrderId: number) => {
    if (!phone) {
      Alert.alert('Error', 'No hay número de teléfono disponible');
      return;
    }

    const message = `Hola ${manufacturerName}, te escribo sobre mi pedido #${subOrderId}`;
    const whatsappUrl = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(whatsappUrl).then(supported => {
      if (supported) {
        Linking.openURL(whatsappUrl);
      } else {
        Alert.alert('Error', 'No se puede abrir WhatsApp. Asegúrate de tenerlo instalado.');
      }
    });
  };

  const renderProductItem = (product: Product) => {
    return product.inventories.map((inventory, idx) => {
      // Mostrar size si color es 'Sin color', sino mostrar color
      const variant = inventory.color === 'Sin color' ? inventory.size : inventory.color;
      
      return (
        <View key={`${product.id}-${idx}`} style={styles.productItem}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productVariant}>{variant}</Text>
            <Text style={styles.productQuantity}>Cantidad: {inventory.totalItem}</Text>
          </View>
          <View style={styles.productPriceContainer}>
            <Text style={styles.productPrice}>
              {formatPrice(product.price * inventory.totalItem)}
            </Text>
            <Text style={styles.productUnitPrice}>
              {formatPrice(product.price)} c/u
            </Text>
          </View>
        </View>
      );
    });
  };

  const renderPackItem = (pack: Pack) => {
    return (
      <View key={pack.id} style={styles.productItem}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{pack.name}</Text>
          <Text style={styles.productQuantity}>Cantidad: {pack.totalItem}</Text>
        </View>
        <View style={styles.productPriceContainer}>
          <Text style={styles.productPrice}>
            {formatPrice(pack.price * pack.totalItem)}
          </Text>
          <Text style={styles.productUnitPrice}>
            {formatPrice(pack.price)} c/u
          </Text>
        </View>
      </View>
    );
  };

  const renderSubOrder = (subOrder: SubOrder, index: number) => {
    const manufacturerName = subOrder.user.manufacturer?.name || 'Fabricante';
    const manufacturerPhone = subOrder.user.manufacturer?.phone || '';

    return (
      <View key={subOrder.id} style={styles.subOrderCard}>
        {/* Header del fabricante */}
        <View style={styles.manufacturerHeader}>
          <View style={styles.manufacturerInfo}>
            <Ionicons name="storefront-outline" size={20} color={Colors.blue.default} />
            <Text style={styles.manufacturerName}>{manufacturerName}</Text>
          </View>
          <TouchableOpacity
            style={styles.whatsappButton}
            onPress={() => handleWhatsApp(manufacturerPhone, manufacturerName, subOrder.id)}
          >
            <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
            <Text style={styles.whatsappText}>Contactar</Text>
          </TouchableOpacity>
        </View>

        {/* Productos */}
        <View style={styles.productsContainer}>
          {subOrder.products.map(product => renderProductItem(product))}
          {subOrder.packs.map(pack => renderPackItem(pack))}
        </View>

        {/* Subtotal del fabricante */}
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalLabel}>Subtotal</Text>
          <Text style={styles.subtotalAmount}>{formatPrice(subOrder.subtotal)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={Colors.gray.semiDark} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Pedido #{order.id}</Text>
          <Text style={styles.headerSubtitle}>
            {order.unifique ? 'Pedido unificado' : 'Pedido individual'}
          </Text>
        </View>
        
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {order.subOrders.map((subOrder, index) => renderSubOrder(subOrder, index))}

        {/* Total general */}
        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total del pedido</Text>
            <Text style={styles.totalAmount}>{formatPrice(order.total)}</Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    ...shadows.sm,
  },
  closeButton: {
    padding: spacing.xs,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  subOrderCard: {
    backgroundColor: '#fff',
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  manufacturerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  manufacturerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  manufacturerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: spacing.sm,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D36615',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  whatsappText: {
    color: '#25D366',
    fontSize: 13,
    fontWeight: '600',
  },
  productsContainer: {
    padding: spacing.md,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productInfo: {
    flex: 1,
    paddingRight: spacing.md,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  productVariant: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  productQuantity: {
    fontSize: 12,
    color: '#999',
  },
  productPriceContainer: {
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  productUnitPrice: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  subtotalLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  subtotalAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalCard: {
    backgroundColor: Colors.blue.default,
    marginTop: spacing.lg,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    ...shadows.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});

export default OrderModal;