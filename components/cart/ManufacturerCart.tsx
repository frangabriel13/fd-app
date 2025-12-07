import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { spacing, borderRadius, shadows } from '@/constants/Styles';
import type { CartManufacturerDisplay } from '@/types/cart';

interface ManufacturerCartProps {
  manufacturer: CartManufacturerDisplay;
}

const ManufacturerCart: React.FC<ManufacturerCartProps> = ({ manufacturer }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.manufacturerCard}>
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
          onPress={toggleExpanded}
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

const styles = StyleSheet.create({
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
});

export default ManufacturerCart;