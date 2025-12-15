import { View, Text, StyleSheet } from 'react-native';
import MenuGender from '@/components/shop/MenuGender';
import SelectCategory from '@/components/shop/SelectCategory';

const ShopScreen = () => {
  return (
    <View style={styles.container}>
      <MenuGender />
      <SelectCategory />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
});


export default ShopScreen;