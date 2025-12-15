import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';

type Gender = {
  id: number;
  name: string;
  url: string;
};

const genders: Gender[] = [
  { id: 2, name: 'Hombre', url: 'hombre' },
  { id: 3, name: 'Mujer', url: 'mujer' },
  { id: 4, name: 'Niño', url: 'niño' },
  { id: 5, name: 'Niña', url: 'niña' },
  { id: 6, name: 'Bebés', url: 'bebes' },
  { id: 7, name: 'Otros', url: 'otros' },
];

const MenuGender = () => {
  const [selectedGender, setSelectedGender] = useState<number>(3); // Mujer por defecto

  const handleGenderSelect = (genderId: number) => {
    setSelectedGender(genderId);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {genders.map((gender, index) => (
          <TouchableOpacity
            key={gender.id}
            style={[
              styles.genderButton,
              selectedGender === gender.id && styles.selectedButton,
              index === 0 && styles.firstButton,
              index === genders.length - 1 && styles.lastButton,
            ]}
            onPress={() => handleGenderSelect(gender.id)}
          >
            <Text style={[
              styles.genderText,
              selectedGender === gender.id && styles.selectedText
            ]}>
              {gender.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.orange.default,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  firstButton: {
    paddingLeft: 20,
  },
  lastButton: {
    paddingRight: 20,
  },
  selectedButton: {
    borderBottomColor: Colors.blue.default,
  },
  genderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  selectedText: {
    color: Colors.blue.default,
  },
});


export default MenuGender;