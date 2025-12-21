import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { genders } from '@/utils/hardcode';
import { Colors } from '@/constants/Colors';

type SelectCategoryProps = {
  selectedGenderId: number;
  onCategorySelect?: (categoryId: number) => void;
};

const SelectCategory = ({ selectedGenderId, onCategorySelect }: SelectCategoryProps) => {
  const selectedGender = genders.find(gender => gender.id === selectedGenderId);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
    onCategorySelect?.(categoryId);
  };

  useEffect(() => {
    if (selectedGender) {
      console.log(`Categorías de ${selectedGender.name}:`, selectedGender.categories);
      setSelectedCategory(null); // Reset selection when gender changes
    }
  }, [selectedGender]);

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {selectedGender?.categories.map((category, index) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              index === 0 && styles.firstButton,
              index === selectedGender.categories.length - 1 && styles.lastButton,
            ]}
            onPress={() => handleCategorySelect(category.id)}
          >
            <View style={[
              styles.imageContainer,
              selectedCategory === category.id && styles.selectedImageContainer
            ]}>
              <Image 
                source={category.img} 
                style={styles.categoryImage}
                resizeMode="cover"
              />
            </View>
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.selectedText
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: 6,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 8,
  },
  categoryButton: {
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  firstButton: {
    paddingLeft: 8,
  },
  lastButton: {
    paddingRight: 8,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    overflow: 'hidden',
    // marginBottom: 6,
    backgroundColor: '#f8f8f8',
  },
  selectedImageContainer: {
    borderColor: Colors.blue.default,
    borderWidth: 2.5,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'center',
    maxWidth: 60,
  },
  selectedText: {
    color: Colors.blue.default,
    fontWeight: '600',
  },
});

export default SelectCategory;