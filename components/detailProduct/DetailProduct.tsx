import { View, Text, StyleSheet } from 'react-native';
import { Product, Manufacturer } from '@/types/product';

interface DetailProductProps {
  product?: Product;
  manufacturer?: Manufacturer;
}

const DetailProduct = ({ product, manufacturer }: DetailProductProps) => {
  return (
    <View style={styles.container}>
      <Text>{product?.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
});


export default DetailProduct;