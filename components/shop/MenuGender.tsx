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
  onPress: () => void;
};

const GenderPill = memo(function GenderPill({ gender, isSelected, onPress }: GenderPillProps) {
  return (
    <Pressable
      onPress={onPress}
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
          onPress={() => onGenderSelect?.(gender.id)}
        />
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
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
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.gray.light,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  pillSelected: {
    backgroundColor: Colors.blue.dark,
    borderColor: Colors.blue.dark,
  },
  pillImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray.dark,
  },
  pillTextSelected: {
    color: '#ffffff',
  },
});

export default MenuGender;
