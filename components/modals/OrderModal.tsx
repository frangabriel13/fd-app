import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '@/components/ui';
import { spacing, borderRadius } from '@/constants/Styles';

interface OrderModalProps {
  onClose: () => void;
  order: any | null;
}

const OrderModal: React.FC<OrderModalProps> = ({ onClose, order }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Typography variant="body" className="text-gray-500">
            Cerrar
          </Typography>
        </TouchableOpacity>
        
        <Typography variant="h3" className="text-gray-800 text-center flex-1">
          Detalle del Pedido
        </Typography>
        
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Typography variant="body" className="text-gray-700">
            Contenido del pedido aquí...
          </Typography>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    paddingVertical: spacing.sm,
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    padding: spacing.lg,
    marginTop: spacing.md,
  },
});

export default OrderModal;