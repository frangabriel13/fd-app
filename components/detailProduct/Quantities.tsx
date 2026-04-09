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
  const isActive = currentQuantity > 0;

  return (
    <View style={[styles.row, isActive && styles.rowActive]}>
      {/* Acento lateral */}
      {isActive && <View style={styles.rowAccent} />}

      {/* Identificador: color o talle */}
      <View style={styles.labelSide}>
        {isVariable ? (
          <>
            <View
              style={[
                styles.colorCircle,
                { backgroundColor: getColorValue(inventory.code) },
                isActive && styles.colorCircleActive,
              ]}
            />
            <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={1}>
              {inventory.color}
            </Text>
          </>
        ) : (
          <View style={[styles.sizeChip, isActive && styles.sizeChipActive]}>
            <Text style={[styles.sizeChipText, isActive && styles.sizeChipTextActive]}>
              {inventory.size}
            </Text>
          </View>
        )}
      </View>

      {/* Pill unificado: − cantidad + */}
      <View style={[styles.pill, isActive && styles.pillActive]}>
        <Pressable
          style={styles.pillBtn}
          onPress={() => onDecrement(inventory.id)}
          disabled={currentQuantity === 0}
          android_ripple={{ color: Colors.gray.light, borderless: true }}
          hitSlop={4}
        >
          <Ionicons
            name="remove"
            size={16}
            color={currentQuantity === 0 ? Colors.gray.default : Colors.blue.dark}
          />
        </Pressable>

        <View style={styles.pillDivider} />

        <Text style={[styles.pillQty, isActive && styles.pillQtyActive]}>
          {currentQuantity}
        </Text>

        <View style={styles.pillDivider} />

        <Pressable
          style={styles.pillBtn}
          onPress={() => onIncrement(inventory.id)}
          android_ripple={{ color: Colors.gray.light, borderless: true }}
          hitSlop={4}
        >
          <Ionicons name="add" size={16} color={Colors.blue.dark} />
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

    const validQuantity = Math.max(0, newQuantity);
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
          {isVariable ? 'Colores' : 'Talles'}
        </Text>
        {totalSelected > 0 && (
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeText}>{totalSelected} u. seleccionadas</Text>
          </View>
        )}
      </View>

      {/* Lista de variantes */}
      <View style={styles.list}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  // Encabezado
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
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
    fontSize: 11,
    fontWeight: '700',
  },

  // Lista
  list: {
    gap: 6,
  },

  // Fila
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray.light,
    backgroundColor: '#fff',
    gap: 8,
  },
  rowActive: {
    borderColor: Colors.blue.dark + '30',
    backgroundColor: Colors.blue.dark + '05',
  },
  rowAccent: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 3,
    borderRadius: 2,
    backgroundColor: Colors.blue.dark,
  },

  // Label side
  labelSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // Color
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.1)',
    flexShrink: 0,
  },
  colorCircleActive: {
    borderColor: Colors.blue.dark,
    borderWidth: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray.dark,
    flex: 1,
  },
  labelActive: {
    color: '#111827',
    fontWeight: '600',
  },

  // Talle chip
  sizeChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.gray.light,
    backgroundColor: Colors.gray.light,
  },
  sizeChipActive: {
    borderColor: Colors.blue.dark,
    backgroundColor: Colors.blue.dark + '0D',
  },
  sizeChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray.dark,
  },
  sizeChipTextActive: {
    color: Colors.blue.dark,
  },

  // Pill unificado
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray.light,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  pillActive: {
    borderColor: Colors.blue.dark + '50',
  },
  pillBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.gray.light,
  },
  pillQty: {
    minWidth: 32,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray.semiDark,
    paddingHorizontal: 4,
  },
  pillQtyActive: {
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
  },
});

export default Quantities;
