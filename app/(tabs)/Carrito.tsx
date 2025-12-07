import { Text, View, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { useCart } from '@/hooks/useCart';

const CartScreen = () => {
  const { cartData, fetchCartData, isEmpty, addToCart } = useCart();

  useEffect(() => {
    if (!isEmpty) {
      fetchCartData()
        .then((data) => {
          console.log('🛒 Cart Data:', data);
        })
        .catch((error) => {
          console.error('❌ Error fetching cart:', error);
        });
    } else {
      console.log('🛒 Cart is empty');
    }
  }, [isEmpty]);

  // Función para agregar un item de prueba al carrito
  const handleAddTestItem = () => {
    addToCart({
      manufacturerId: 1,
      productId: 'test-product-1',
      inventoryId: 1,
      quantity: 1
    });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Tu carrito</Text>
      
      {isEmpty && (
        <TouchableOpacity 
          onPress={handleAddTestItem}
          style={{
            backgroundColor: '#007bff',
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 20
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            Agregar item de prueba al carrito
          </Text>
        </TouchableOpacity>
      )}
      
      <Text style={{ fontSize: 16, color: '#666' }}>
        {isEmpty ? 'El carrito está vacío' : `${Object.keys(cartData).length} fabricantes en el carrito`}
      </Text>
    </View>
  );
}

export default CartScreen;