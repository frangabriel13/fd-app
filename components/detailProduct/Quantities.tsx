import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useState, useEffect, memo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/hooks/useCart';
import { useCartAnimationContext } from '@/contexts/CartAnimationContext';
import { getColorValue } from '@/utils/formatters';
import { Colors } from '@/constants/Colors';

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

const QuantityRow = memo(function QuantityRow({
  inventory,
  isVariable,
  currentQuantity,
  onDecrement,
  onIncrement,
}: QuantityRowProps) {
  const displayLabel = isVariable ? inventory.color : inventory.size;
  const isOutOfStock = inventory.stock === 0;
  const isActive = currentQuantity > 0;

  return (
    <View style={[styles.row, isActive && styles.rowActive]}>
      {/* Color/Talle */}
      <View style={styles.labelSide}>
        {isVariable && (
          <View
            style={[
              styles.colorDot,
              { backgroundColor: getColorValue(inventory.code) },
            ]}
          />
        )}
        <Text style={[styles.label, isOutOfStock && styles.labelDisabled]}>
          {displayLabel}
        </Text>
      </View>

      {/* Controles */}
      <View style={styles.controls}>
        <Pressable
          style={({ pressed }) => [
            styles.controlBtn,
            (currentQuantity === 0 || isOutOfStock) && styles.controlBtnDisabled,
            pressed && currentQuantity > 0 && styles.controlBtnPressed,
          ]}
          onPress={() => onDecrement(inventory.id)}
          disabled={currentQuantity === 0 || isOutOfStock}
        >
          <Ionicons
            name="remove"
            size={18}
            color={currentQuantity === 0 || isOutOfStock ? Colors.gray.default : Colors.blue.dark}
          />
        </Pressable>

        <Text style={[styles.quantityText, isActive && styles.quantityTextActive]}>
          {currentQuantity}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.controlBtn,
            (currentQuantity >= inventory.stock || isOutOfStock) && styles.controlBtnDisabled,
            pressed && currentQuantity < inventory.stock && styles.controlBtnPressed,
          ]}
          onPress={() => onIncrement(inventory.id)}
          disabled={currentQuantity >= inventory.stock || isOutOfStock}
        >
          <Ionicons
            name="add"
            size={18}
            color={
              currentQuantity >= inventory.stock || isOutOfStock
                ? Colors.gray.default
                : Colors.blue.dark
            }
          />
        </Pressable>
      </View>
    </View>
  );
});

const Quantities = ({
  isVariable,
  inventories = [],
  onQuantityChange,
  manufacturerId,
  productId,
}: QuantitiesProps) => {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const { addToCart, updateCartItem, removeFromCart, manufacturers } = useCart();
  const { triggerAnimation } = useCartAnimationContext();

  // Solo los inventarios de este producto en el carrito
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

    setQuantities(prev => ({ ...prev, [inventoryId]: validQuantity }));

    if (validQuantity > 0) {
      const product = manufacturers[manufacturerId]?.[productId];
      const cartItem = product?.find(item => item.inventoryId === inventoryId);
      const currentQuantity = cartItem?.quantity || 0;

      if (currentQuantity === 0) {
        addToCart({ manufacturerId, productId, inventoryId, quantity: validQuantity });
        triggerAnimation();
      } else {
        updateCartItem({ manufacturerId, productId, inventoryId, quantity: validQuantity });
        if (validQuantity > currentQuantity) triggerAnimation();
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

  const totalSelected = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  if (!inventories.length) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cube-outline" size={28} color={Colors.gray.default} />
        <Text style={styles.emptyText}>Sin inventario disponible</Text>
      </View>
    );
  }

  return (
    <View>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {isVariable ? 'Seleccionar colores' : 'Seleccionar talles'}
        </Text>
        {totalSelected > 0 && (
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeText}>{totalSelected} u.</Text>
          </View>
        )}
      </View>

      {/* Filas de inventario */}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  totalBadge: {
    backgroundColor: Colors.blue.dark,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  totalBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  // Filas
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  rowActive: {
    backgroundColor: Colors.blue.dark + '06',
    borderRadius: 8,
    borderBottomColor: 'transparent',
    marginBottom: 2,
  },
  labelSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  colorDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
  labelDisabled: {
    color: Colors.gray.default,
  },

  // Controles +/-
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: Colors.blue.dark + '40',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlBtnDisabled: {
    borderColor: Colors.gray.light,
    backgroundColor: Colors.gray.light,
  },
  controlBtnPressed: {
    backgroundColor: Colors.blue.dark + '10',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 28,
    textAlign: 'center',
    color: Colors.gray.semiDark,
  },
  quantityTextActive: {
    color: Colors.blue.dark,
    fontWeight: '700',
  },

  // Estado vacío
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray.semiDark,
    textAlign: 'center',
  },
});

export default Quantities;
