import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect, memo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/hooks/useCart';
import { useCartAnimationContext } from '@/contexts/CartAnimationContext';
import { getColorValue } from '@/utils/formatters';

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
  manufacturerId: number;
  productId: string;
}

interface QuantityRowProps {
  inventory: Inventory;
  isVariable: boolean | undefined;
  currentQuantity: number;
  onDecrement: (id: number) => void;
  onIncrement: (id: number) => void;
}

const QuantityRow = memo(function QuantityRow({ inventory, isVariable, currentQuantity, onDecrement, onIncrement }: QuantityRowProps) {
  const displayLabel = isVariable ? inventory.color : inventory.size;
  const isOutOfStock = inventory.stock === 0;

  return (
    <View style={styles.quantityRow}>
      {/* Talle/Color a la izquierda */}
      <View style={styles.labelContainer}>
        <View style={styles.labelRow}>
          {isVariable && (
            <View style={[
              styles.colorIndicator,
              { backgroundColor: getColorValue(inventory.code) }
            ]} />
          )}
          <Text style={[styles.label, isOutOfStock && styles.labelDisabled]}>
            {displayLabel}
          </Text>
        </View>
      </View>

      {/* Controles de cantidad a la derecha */}
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={[
            styles.quantityButton,
            (currentQuantity === 0 || isOutOfStock) && styles.quantityButtonDisabled
          ]}
          onPress={() => onDecrement(inventory.id)}
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
          onPress={() => onIncrement(inventory.id)}
          disabled={currentQuantity >= inventory.stock || isOutOfStock}
        >
          <Ionicons name="add" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const Quantities = ({ isVariable, inventories = [], onQuantityChange, manufacturerId, productId }: QuantitiesProps) => {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const { addToCart, updateCartItem, removeFromCart, manufacturers } = useCart();
  const { triggerAnimation } = useCartAnimationContext();

  // Solo los inventarios de este producto en el carrito — cambia de referencia únicamente cuando este producto específico se modifica
  const cartItems = manufacturers[manufacturerId]?.[productId];

  // Sincronizar con el carrito cuando cambien los items de este producto
  useEffect(() => {
    const initialQuantities: Record<number, number> = {};
    inventories.forEach(inventory => {
      const cartItem = cartItems?.find(item => item.inventoryId === inventory.id);
      initialQuantities[inventory.id] = cartItem?.quantity || 0;
    });
    setQuantities(initialQuantities);
  }, [inventories, manufacturerId, productId, cartItems]);

  const updateQuantity = (inventoryId: number, newQuantity: number) => {
    const inventory = inventories.find(inv => inv.id === inventoryId);
    if (!inventory) return;

    const validQuantity = Math.max(0, Math.min(newQuantity, inventory.stock));

    setQuantities(prev => ({
      ...prev,
      [inventoryId]: validQuantity
    }));

    if (validQuantity > 0) {
      const product = manufacturers[manufacturerId]?.[productId];
      const cartItem = product?.find(item => item.inventoryId === inventoryId);
      const currentQuantity = cartItem?.quantity || 0;

      if (currentQuantity === 0) {
        addToCart({ manufacturerId, productId, inventoryId, quantity: validQuantity });
        triggerAnimation();
      } else {
        updateCartItem({ manufacturerId, productId, inventoryId, quantity: validQuantity });
        if (validQuantity > currentQuantity) {
          triggerAnimation();
        }
      }
    } else {
      removeFromCart({ manufacturerId, productId, inventoryId });
    }

    onQuantityChange?.(inventoryId, validQuantity);
  };

  const handleDecrement = (inventoryId: number) => {
    updateQuantity(inventoryId, (quantities[inventoryId] || 0) - 1);
  };

  const handleIncrement = (inventoryId: number) => {
    updateQuantity(inventoryId, (quantities[inventoryId] || 0) + 1);
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
      {inventories.map(inventory => (
        <QuantityRow
          key={inventory.id}
          inventory={inventory}
          isVariable={isVariable}
          currentQuantity={quantities[inventory.id] || 0}
          onDecrement={handleDecrement}
          onIncrement={handleIncrement}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    color: '#6b7280',
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  labelContainer: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
