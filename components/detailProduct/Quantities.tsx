import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/hooks/useCart';

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

const Quantities = ({ isVariable, inventories = [], onQuantityChange, manufacturerId, productId }: QuantitiesProps) => {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const { addToCart, updateCartItem, manufacturers } = useCart();

  // Sincronizar con el carrito cuando cambie el estado del carrito
  useEffect(() => {
    const initialQuantities: Record<number, number> = {};
    inventories.forEach(inventory => {
      const product = manufacturers[manufacturerId]?.[productId];
      const cartItem = product?.find(item => item.inventoryId === inventory.id);
      const cartQuantity = cartItem?.quantity || 0;
      initialQuantities[inventory.id] = cartQuantity;
    });
    setQuantities(initialQuantities);
  }, [inventories, manufacturerId, productId, manufacturers]);

  const updateQuantity = (inventoryId: number, newQuantity: number) => {
    const inventory = inventories.find(inv => inv.id === inventoryId);
    if (!inventory) return;

    // No permitir cantidades negativas o mayor al stock
    const validQuantity = Math.max(0, Math.min(newQuantity, inventory.stock));
    
    // Actualizar estado local
    setQuantities(prev => ({
      ...prev,
      [inventoryId]: validQuantity
    }));

    // Actualizar carrito
    if (validQuantity > 0) {
      const product = manufacturers[manufacturerId]?.[productId];
      const cartItem = product?.find(item => item.inventoryId === inventoryId);
      const currentQuantity = cartItem?.quantity || 0;
      
      if (currentQuantity === 0) {
        // Agregar al carrito
        addToCart({
          manufacturerId,
          productId,
          inventoryId,
          quantity: validQuantity
        });
      } else {
        // Actualizar cantidad
        updateCartItem({
          manufacturerId,
          productId,
          inventoryId,
          quantity: validQuantity
        });
      }
    } else {
      // Eliminar del carrito si la cantidad es 0
      updateCartItem({
        manufacturerId,
        productId,
        inventoryId,
        quantity: 0
      });
    }

    // Callback opcional
    onQuantityChange?.(inventoryId, validQuantity);
    // console.log('🛒 Estado del carrito actualizado:', JSON.stringify(manufacturers, null, 2));
  };

  const getQuantity = (inventoryId: number) => {
    return quantities[inventoryId] || 0;
  };

  const renderQuantityRow = (inventory: Inventory) => {
    const currentQuantity = getQuantity(inventory.id);
    const displayLabel = isVariable ? inventory.color : inventory.size;
    const isOutOfStock = inventory.stock === 0;

    // Formatear el color para asegurar compatibilidad
    const getColorValue = (code: string | null) => {
      if (!code) return '#ccc';
      
      // Si ya tiene formato hex, devolverlo tal como está
      if (code.startsWith('#')) return code;
      
      // Si es un nombre de color CSS, devolverlo
      if (/^[a-zA-Z]+$/.test(code)) return code;
      
      // Si es RGB/HSL, devolverlo
      if (code.startsWith('rgb') || code.startsWith('hsl')) return code;
      
      // Si es solo hex sin #, añadir el #
      if (/^[0-9A-Fa-f]{6}$/.test(code)) return `#${code}`;
      
      // Por defecto, gris claro
      return '#ccc';
    };

    return (
      <View key={inventory.id} style={styles.quantityRow}>
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
          {/* <Text style={[styles.stockText, isOutOfStock && styles.stockTextDisabled]}>
            Stock: {inventory.stock}
          </Text> */}
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
    marginTop: 8,
    // padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    // marginBottom: 16,
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
  // stockText: {
  //   fontSize: 12,
  //   color: '#666',
  // },
  // stockTextDisabled: {
  //   color: '#999',
  // },
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