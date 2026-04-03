import { memo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';
import { genders } from '@/utils/hardcode';

type MenuGenderProps = {
  selectedGender?: number | null;
  onGenderSelect?: (genderId: number) => void;
};

type GenderPillProps = {
  gender: (typeof genders)[number];
  isSelected: boolean;
  onSelect: (id: number) => void;
};

const GenderPill = memo(function GenderPill({ gender, isSelected, onSelect }: GenderPillProps) {
  return (
    <Pressable
      onPress={() => onSelect(gender.id)}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`Filtrar por ${gender.name}`}
    >
      <View style={[styles.pill, isSelected && styles.pillSelected]}>
        <Image
          source={{ uri: gender.url }}
          style={styles.pillImage}
          contentFit="cover"
          transition={150}
        />
        <Text style={[styles.pillText, isSelected && styles.pillTextSelected]} numberOfLines={1}>
          {gender.name}
        </Text>
      </View>
    </Pressable>
  );
});

const MenuGender = ({ selectedGender, onGenderSelect }: MenuGenderProps) => (
  <View style={styles.container}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {genders.map((gender) => (
        <GenderPill
          key={gender.id}
          gender={gender}
          isSelected={selectedGender === gender.id}
          onSelect={onGenderSelect ?? (() => {})}
        />
      ))}
    </ScrollView>
  </View>
);

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

export default MenuGender;
