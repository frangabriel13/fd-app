import { View, Text, StyleSheet } from 'react-native';
import { Product, Manufacturer } from '@/types/product';

interface DetailProductProps {
  product?: Product;
  manufacturer?: Manufacturer;
}

const DetailProduct = ({ product, manufacturer }: DetailProductProps) => {
  return (
    <View style={styles.container}>
      <View>
        <Text>{product?.category.name} | {product?.attributes.genre}</Text>
        <View>
          <Text>{product?.name}</Text>
          <View>
            {/* iconos de compartir y favoritos */}
          </View>
        </View>
        <View>
          <Text>${product?.price}</Text>
          <Text>Comprando al por mayor</Text>
        </View>
        <View>
          <Text>Contacta con {manufacturer?.name}</Text>
          <View>
            {/* Button WhatsApp y icono de ubicación con la ubicación del fabricante */}
          </View>
        </View>
      </View>
      <View>
        <Text>Descripción:</Text>
        <View>
          <Text>{product?.description || 'Sin descripción'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
});


export default DetailProduct;