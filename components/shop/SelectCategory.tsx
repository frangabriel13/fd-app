import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { genders } from '@/utils/hardcode';

type SelectCategoryProps = {
  selectedGenderId: number;
};

const SelectCategory = ({ selectedGenderId }: SelectCategoryProps) => {
  const selectedGender = genders.find(gender => gender.id === selectedGenderId);

  useEffect(() => {
    if (selectedGender) {
      console.log(`Categorías de ${selectedGender.name}:`, selectedGender.categories);
    }
  }, [selectedGender]);

  return (
    <View style={styles.container}>
      {selectedGender?.categories.map((category, index) => (
        <View key={index} style={styles.categoryContainer}>
          <Image source={category.img} style={styles.image} />
          <Text style={styles.categoryName}>{category.name}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
  },
});

export default SelectCategory;