import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/hooks/useCart';
import { useCartAnimationContext } from '@/contexts/CartAnimationContext';
import { CartManufacturerDisplay, CartItemDisplay } from '@/types/cart';

interface DetailCartProps {
  manufacturer: CartManufacturerDisplay;
  onRemoveManufacturer?: (manufacturerId: number) => void;
}

interface GroupedProduct {
  productId: string;
  productName?: string;
  productImage?: string;
  price?: number;
  salePrice?: number;
  variations: CartItemDisplay[];
}

const DetailCart = ({ manufacturer, onRemoveManufacturer }: DetailCartProps) => {
  const { updateCartItem, removeFromCart } = useCart();
  const { triggerAnimation } = useCartAnimationContext();

  // Agrupar items por producto
  const groupedProducts: GroupedProduct[] = manufacturer.items.reduce((acc: GroupedProduct[], item) => {
    const existingProduct = acc.find(p => p.productId === item.productId);
    
    if (existingProduct) {
      existingProduct.variations.push(item);
    } else {
      acc.push({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        price: item.price,
        salePrice: item.salePrice,
        variations: [item]
      });
    }
    
    return acc;
  }, []);

  const updateQuantity = (item: CartItemDisplay, newQuantity: number) => {
    // No permitir cantidades negativas
    const validQuantity = Math.max(0, newQuantity);
    
    if (validQuantity > 0) {
      const currentQuantity = item.quantity;
      
      // Actualizar cantidad
      updateCartItem({
        manufacturerId: item.manufacturerId,
        productId: item.productId,
        inventoryId: item.inventoryId,
        quantity: validQuantity
      });
      
      // Disparar animación solo si incrementamos la cantidad
      if (validQuantity > currentQuantity) {
        triggerAnimation();
      }
    } else {
      // Eliminar del carrito si la cantidad es 0
      removeFromCart({
        manufacturerId: item.manufacturerId,
        productId: item.productId,
        inventoryId: item.inventoryId
      });
    }
  };

  const renderVariationRow = (item: CartItemDisplay, isVariable: boolean) => {
    // Si el color es "Sin color" o está vacío, mostrar el size en su lugar
    const shouldShowSize = !item.color || item.color.trim() === '' || item.color.toLowerCase() === 'sin color';
    const displayLabel = shouldShowSize ? item.size : item.color;
    const showColorIndicator = isVariable && !shouldShowSize && item.color;
    
    const currentQuantity = item.quantity;
    const displayPrice = item.salePrice || item.price || 0;

    // Formatear el color para asegurar compatibilidad
    const getColorValue = (color?: string) => {
      if (!color) return '#ccc';
      
      // Si ya tiene formato hex, devolverlo tal como está
      if (color.startsWith('#')) return color;
      
      // Si es un nombre de color CSS, devolverlo
      if (/^[a-zA-Z]+$/.test(color)) return color;
      
      // Si es RGB/HSL, devolverlo
      if (color.startsWith('rgb') || color.startsWith('hsl')) return color;
      
      // Si es solo hex sin #, añadir el #
      if (/^[0-9A-Fa-f]{6}$/.test(color)) return `#${color}`;
      
      // Por defecto, gris claro
      return '#ccc';
    };

    console.log('item:', item);

    return (
      <View key={item.inventoryId} style={styles.variationRow}>
        {/* Información de la variación a la izquierda */}
        <View style={styles.variationInfo}>
          <View style={styles.variationLabel}>
            {showColorIndicator && (
              <View style={[
                styles.colorIndicator, 
                { backgroundColor: getColorValue(item.color) }
              ]} />
            )}
            <Text style={styles.variationText}>
              {displayLabel || 'N/A'}
            </Text>
          </View>
          {/* <Text style={styles.priceText}>
            ${displayPrice.toLocaleString('es-AR', { minimumFractionDigits: 0 })}
          </Text> */}
        </View>

        {/* Controles de cantidad a la derecha */}
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              currentQuantity === 0 && styles.quantityButtonDisabled
            ]}
            onPress={() => updateQuantity(item, currentQuantity - 1)}
            disabled={currentQuantity === 0}
          >
            <Ionicons name="remove" size={18} color="#666" />
          </TouchableOpacity>

          <Text style={styles.quantityText}>
            {currentQuantity}
          </Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item, currentQuantity + 1)}
          >
            <Ionicons name="add" size={18} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderProduct = (product: GroupedProduct) => {
    const hasColorVariations = product.variations.some(v => v.color && v.color.trim() !== '');
    const isVariable = hasColorVariations;

    return (
      <View key={product.productId} style={styles.productContainer}>
        {/* Header del producto */}
        <View style={styles.productHeader}>
          {/* Imagen del producto */}
          <View style={styles.imageContainer}>
            {product.productImage ? (
              <Image 
                source={{ uri: product.productImage }} 
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.productImage, styles.placeholderImage]}>
                <Ionicons name="image-outline" size={24} color="#ccc" />
              </View>
            )}
          </View>
          
          {/* Información del producto */}
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {product.productName || 'Producto sin nombre'}
            </Text>
          </View>
        </View>

        {/* Variaciones */}
        <View style={styles.variationsContainer}>
          {/* <Text style={styles.variationsTitle}>
            {isVariable ? 'Colores y talles' : 'Talles disponibles'}
          </Text> */}
          {product.variations.map(item => renderVariationRow(item, isVariable))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {groupedProducts.map(renderProduct)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 16,
    gap: 12,
  },
  productContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  productHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  imageContainer: {
    width: 80,
    height: 80,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  placeholderImage: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 20,
  },
  variationsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  variationsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  variationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  variationInfo: {
    flex: 1,
  },
  variationLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  variationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  priceText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
});

export default DetailCart;