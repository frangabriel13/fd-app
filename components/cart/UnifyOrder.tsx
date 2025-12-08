import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { spacing, borderRadius, shadows } from '@/constants/Styles';

interface UnifyOrderProps {
  totalAmount: number;
  totalItems: number;
  manufacturersCount: number;
  onClearCart?: () => void;
}

const UnifyOrder: React.FC<UnifyOrderProps> = ({ 
  totalAmount, 
  totalItems, 
  manufacturersCount, 
  onClearCart 
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <View style={styles.cartSummary}>
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>Resumen del pedido</Text>
        <Text style={styles.summaryTotal}>{formatPrice(totalAmount)}</Text>
      </View>
      
      <Text style={styles.summarySubtitle}>
        {totalItems} {totalItems === 1 ? 'producto' : 'productos'} de {manufacturersCount} {manufacturersCount === 1 ? 'fabricante' : 'fabricantes'}
      </Text>

      <View style={styles.summaryActions}>
        <TouchableOpacity 
          style={styles.unifyOrderButton}
          onPress={onClearCart}
        >
          <Ionicons name="package-outline" size={20} color="white" />
          <Text style={styles.unifyOrderButtonText}>Unificar pedido</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.clearCartButton}
          onPress={onClearCart}
        >
          <Ionicons name="trash-outline" size={18} color={Colors.general.error} />
          <Text style={styles.clearCartButtonText}>Vaciar carrito</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.unifyDescription}>
        Unifica el pedido para que todas tus compras se agrupen en un único envío.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default UnifyOrder;