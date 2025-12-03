import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface Inventory {
  id: number;
  code: string | null;
  color: string;
  size: string;
  stock: number;
}

interface QuantitiesProps {
  isVariable?: boolean;
  inventories?: Inventory[];
  onQuantityChange?: (inventoryId: number, quantity: number) => void;
}

const Quantities = ({ isVariable, inventories = [], onQuantityChange }: QuantitiesProps) => {
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const updateQuantity = (inventoryId: number, newQuantity: number) => {
    const inventory = inventories.find(inv => inv.id === inventoryId);
    if (!inventory) return;

    // No permitir cantidades negativas o mayor al stock
    const validQuantity = Math.max(0, Math.min(newQuantity, inventory.stock));
    
    setQuantities(prev => ({
      ...prev,
      [inventoryId]: validQuantity
    }));

    onQuantityChange?.(inventoryId, validQuantity);
  };

  const getQuantity = (inventoryId: number) => {
    return quantities[inventoryId] || 0;
  };

  const renderQuantityRow = (inventory: Inventory) => {
    const currentQuantity = getQuantity(inventory.id);
    const displayLabel = isVariable ? inventory.color : inventory.size;
    const isOutOfStock = inventory.stock === 0;

    return (
      <View key={inventory.id} style={styles.quantityRow}>
        {/* Talle/Color a la izquierda */}
        <View style={styles.labelContainer}>
          <Text style={[styles.label, isOutOfStock && styles.labelDisabled]}>
            {displayLabel}
          </Text>
          <Text style={[styles.stockText, isOutOfStock && styles.stockTextDisabled]}>
            Stock: {inventory.stock}
          </Text>
        </View>

        {/* Controles de cantidad a la derecha */}
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              (currentQuantity === 0 || isOutOfStock) && styles.quantityButtonDisabled
            ]}
            onPress={() => updateQuantity(inventory.id, currentQuantity - 1)}
            disabled={currentQuantity === 0 || isOutOfStock}
          >
            <Ionicons name="remove" size={20} color="#666" />
          </TouchableOpacity>

          <Text style={[styles.quantityText, isOutOfStock && styles.quantityTextDisabled]}>
            {currentQuantity}
          </Text>

          <TouchableOpacity
            style={[
              styles.quantityButton,
              (currentQuantity >= inventory.stock || isOutOfStock) && styles.quantityButtonDisabled
            ]}
            onPress={() => updateQuantity(inventory.id, currentQuantity + 1)}
            disabled={currentQuantity >= inventory.stock || isOutOfStock}
          >
            <Ionicons name="add" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!inventories.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.noInventoryText}>No hay inventario disponible</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isVariable ? 'Seleccionar Colores' : 'Seleccionar Talles'}
      </Text>
      {inventories.map(renderQuantityRow)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  labelDisabled: {
    color: '#999',
  },
  stockText: {
    fontSize: 12,
    color: '#666',
  },
  stockTextDisabled: {
    color: '#999',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quantityButtonDisabled: {
    backgroundColor: '#f9f9f9',
    borderColor: '#f0f0f0',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
    color: '#333',
  },
  quantityTextDisabled: {
    color: '#999',
  },
  noInventoryText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    paddingVertical: 20,
  },
});

export default Quantities;