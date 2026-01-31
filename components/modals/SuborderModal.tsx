import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, borderRadius, shadows } from '@/constants/Styles';
import { Colors } from '@/constants/Colors';

interface Product {
  id: number | string;
  name: string;
  price: number;
  inventories: {
    color: string;
    size: string;
    totalItem: number;
  }[];
}

interface Pack {
  id: number | string;
  name: string;
  price: number;
  totalItem: number;
}

interface User {
  id: number;
  email: string;
  wholesaler?: {
    id: number;
    name: string;
    phone: string;
  };
  manufacturer?: {
    id: number;
    name: string;
    phone: string;
  };
}

interface SubOrder {
  id: number;
  subtotal: number | string;
  status: string;
  products: Product[];
  packs: Pack[];
  user: User;
  order: {
    id: number;
    total: string;
    user: User;
  };
  createdAt?: string;
}

interface SuborderModalProps {
  onClose: () => void;
  subOrder: SubOrder | null;
}

const SuborderModal: React.FC<SuborderModalProps> = ({ onClose, subOrder }) => {
  if (!subOrder) return null;

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const wholesalerName = subOrder.order?.user?.wholesaler?.name || 'Mayorista';
  const wholesalerEmail = subOrder.order?.user?.email || '';
  const wholesalerPhone = subOrder.order?.user?.wholesaler?.phone || '';

  const handleWhatsApp = () => {
    if (!wholesalerPhone) {
      Alert.alert('Error', 'No hay número de teléfono disponible');
      return;
    }

    const message = `Hola ${wholesalerName}, te escribo sobre tu orden #${subOrder.id}`;
    const whatsappUrl = `whatsapp://send?phone=${wholesalerPhone}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(whatsappUrl).then(supported => {
      if (supported) {
        Linking.openURL(whatsappUrl);
      } else {
        Alert.alert('Error', 'No se puede abrir WhatsApp. Asegúrate de tenerlo instalado.');
      }
    });
  };

  const handleEmail = () => {
    if (!wholesalerEmail) {
      Alert.alert('Error', 'No hay email disponible');
      return;
    }

    const mailUrl = `mailto:${wholesalerEmail}?subject=Orden #${subOrder.id}`;
    Linking.openURL(mailUrl);
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={Colors.gray.semiDark} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Orden #{subOrder.id}</Text>
          <Text style={styles.headerSubtitle}>Detalles de la orden</Text>
        </View>
        
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Información del Mayorista */}
        <View style={styles.wholesalerCard}>
          <View style={styles.wholesalerHeader}>
            <Ionicons name="person-circle-outline" size={24} color={Colors.blue.default} />
            <Text style={styles.wholesalerTitle}>Información del Cliente</Text>
          </View>
          
          <View style={styles.wholesalerInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={18} color="#666" />
              <Text style={styles.infoLabel}>Nombre:</Text>
              <Text style={styles.infoValue}>{wholesalerName}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={18} color="#666" />
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{wholesalerEmail}</Text>
            </View>
            
            {wholesalerPhone && (
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={18} color="#666" />
                <Text style={styles.infoLabel}>Teléfono:</Text>
                <Text style={styles.infoValue}>{wholesalerPhone}</Text>
              </View>
            )}
          </View>

          {/* Botones de contacto */}
          <View style={styles.contactButtons}>
            {wholesalerPhone && (
              <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
                <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                <Text style={styles.whatsappText}>WhatsApp</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.emailButton} onPress={handleEmail}>
              <Ionicons name="mail-outline" size={20} color={Colors.blue.default} />
              <Text style={styles.emailText}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Detalles de la orden */}
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Ionicons name="receipt-outline" size={20} color={Colors.blue.default} />
            <Text style={styles.orderHeaderTitle}>Productos</Text>
          </View>

          <View style={styles.productsContainer}>
            {subOrder.products.map(product => renderProductItem(product))}
            {subOrder.packs.map(pack => renderPackItem(pack))}
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total de la orden</Text>
            <Text style={styles.totalAmount}>{formatPrice(subOrder.subtotal)}</Text>
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
  wholesalerCard: {
    backgroundColor: '#fff',
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  wholesalerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    gap: spacing.sm,
  },
  wholesalerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  wholesalerInfo: {
    padding: spacing.md,
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  contactButtons: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  whatsappButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D36615',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  whatsappText: {
    color: '#25D366',
    fontSize: 14,
    fontWeight: '600',
  },
  emailButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${Colors.blue.default}15`,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  emailText: {
    color: Colors.blue.default,
    fontSize: 14,
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: '#fff',
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    gap: spacing.sm,
  },
  orderHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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

export default SuborderModal;