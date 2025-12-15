import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MenuGender from '@/components/shop/MenuGender';
import SelectCategory from '@/components/shop/SelectCategory';

const ShopScreen = () => {
  const [selectedGender, setSelectedGender] = useState<number>(3); // Mujer por defecto

  const handleGenderChange = (genderId: number) => {
    setSelectedGender(genderId);
  };

  return (
    <View style={styles.container}>
      <MenuGender onGenderSelect={handleGenderChange} />
      <SelectCategory selectedGenderId={selectedGender} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
});


export default ShopScreen;