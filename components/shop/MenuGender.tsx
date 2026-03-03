import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Colors } from '@/constants/Colors';
import { genders } from '@/utils/hardcode';

type MenuGenderProps = {
  selectedGender?: number | null;
  onGenderSelect?: (genderId: number) => void;
};

const MenuGender = ({ selectedGender, onGenderSelect }: MenuGenderProps) => {
  const handleGenderSelect = (genderId: number) => {
    onGenderSelect?.(genderId);
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
              index === 0 && styles.firstButton,
              index === genders.length - 1 && styles.lastButton,
            ]}
            onPress={() => handleGenderSelect(gender.id)}
          >
            <View style={[
              styles.imageContainer,
              selectedGender === gender.id && styles.selectedImageContainer
            ]}>
              <Image 
                source={{ uri: gender.url }} 
                style={styles.genderImage}
                resizeMode="cover"
              />
            </View>
            <Text 
              style={[
                styles.genderText,
                selectedGender === gender.id && styles.selectedText
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
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
    backgroundColor: '#ffffff',
    paddingVertical: 6,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 8,
  },
  genderButton: {
    alignItems: 'center',
    paddingHorizontal: 6,
    minHeight: 60,
    justifyContent: 'flex-start',    width: 70,  },
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
  genderImage: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
  },
  genderText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'center',
    maxWidth: 70,
    lineHeight: 14,
    marginTop: 4,
  },
  selectedText: {
    color: Colors.blue.default,
    fontWeight: '600',
  },
});


export default MenuGender;