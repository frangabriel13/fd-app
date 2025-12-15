import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { genders } from '@/utils/hardcode';

type SelectCategoryProps = {
  selectedGenderId: number;
};

const SelectCategory = ({ selectedGenderId }: SelectCategoryProps) => {
  useEffect(() => {
    const selectedGender = genders.find(gender => gender.id === selectedGenderId);
    if (selectedGender) {
      console.log(`Categorías de ${selectedGender.name}:`, selectedGender.categories);
    }
  }, [selectedGenderId]);

  return (
    <View style={styles.container}>
      <Text>SelectCategory</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
});


export default SelectCategory;