import { memo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';
import { genders } from '@/utils/hardcode';

type SelectCategoryProps = {
  selectedGenderId: number;
  selectedCategoryId?: number;
  onCategorySelect?: (categoryId: number) => void;
};

type CategoryPillProps = {
  category: (typeof genders)[number]['categories'][number];
  isSelected: boolean;
  onSelect: (id: number) => void;
};

const CategoryPill = memo(function CategoryPill({ category, isSelected, onSelect }: CategoryPillProps) {
  return (
    <Pressable
      onPress={() => onSelect(category.id)}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`Filtrar por ${category.name}`}
    >
      <View style={[styles.pill, isSelected && styles.pillSelected]}>
        <Image
          source={{ uri: category.url }}
          style={styles.pillImage}
          contentFit="cover"
          transition={150}
        />
        <Text style={[styles.pillText, isSelected && styles.pillTextSelected]} numberOfLines={1}>
          {category.name}
        </Text>
      </View>
    </Pressable>
  );
});

const SelectCategory = ({ selectedGenderId, selectedCategoryId, onCategorySelect }: SelectCategoryProps) => {
  const selectedGender = genders.find((gender) => gender.id === selectedGenderId);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {selectedGender?.categories.map((category) => (
          <CategoryPill
            key={category.id}
            category={category}
            isSelected={selectedCategoryId === category.id}
            onSelect={onCategorySelect ?? (() => {})}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  scrollContent: {
    paddingHorizontal: 2,
    gap: 2,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 12,
    borderRadius: 20,
    backgroundColor: Colors.gray.light,
    borderWidth: 1.5,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  pillSelected: {
    backgroundColor: Colors.blue.dark,
    borderColor: Colors.blue.dark,
  },
  pillImage: {
    width: 36,
    alignSelf: 'stretch',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray.dark,
    paddingVertical: 9,
  },
  pillTextSelected: {
    color: '#ffffff',
  },
});

export default SelectCategory;
