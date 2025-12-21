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
      <View style={styles.grid}>
        {selectedGender?.categories.map((category, index) => (
          <View key={index} style={styles.card}>
            <Image source={category.img} style={styles.cardImage} />
            <Text style={styles.cardText}>{category.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
});

export default SelectCategory;