import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Colors } from '@/constants/Colors';

// Importar imágenes
import jeansHombre from '@/assets/images/categorias/hombre/jeans.png';
import jeansMujer from '@/assets/images/categorias/mujer/jeans.png';
import buzosNino from '@/assets/images/categorias/nino/buzos.png';
import vestidosNina from '@/assets/images/categorias/nina/vestidos.png';
import bodysBebe from '@/assets/images/categorias/bebes/bodys.png';
import bisuteriaImg from '@/assets/images/categorias/otros/BISUTERIA.png';

type Gender = {
  id: number;
  name: string;
  url: string;
  image: any;
};

const genders: Gender[] = [
  { id: 2, name: 'Hombre', url: 'hombre', image: jeansHombre },
  { id: 3, name: 'Mujer', url: 'mujer', image: jeansMujer },
  { id: 4, name: 'Niño', url: 'niño', image: buzosNino },
  { id: 5, name: 'Niña', url: 'niña', image: vestidosNina },
  { id: 6, name: 'Bebés', url: 'bebes', image: bodysBebe },
  { id: 7, name: 'Otros', url: 'otros', image: bisuteriaImg },
];

type MenuGenderProps = {
  onGenderSelect?: (genderId: number) => void;
};

const MenuGender = ({ onGenderSelect }: MenuGenderProps) => {
  const [selectedGender, setSelectedGender] = useState<number>(3); // Mujer por defecto

  const handleGenderSelect = (genderId: number) => {
    setSelectedGender(genderId);
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
                source={gender.image} 
                style={styles.genderImage}
                resizeMode="cover"
              />
            </View>
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
    paddingVertical: 15,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderButton: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  firstButton: {
    paddingLeft: 20,
  },
  lastButton: {
    paddingRight: 20,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'transparent',
    overflow: 'hidden',
    marginBottom: 8,
  },
  selectedImageContainer: {
    borderColor: Colors.blue.default,
  },
  genderImage: {
    width: '100%',
    height: '100%',
  },
  genderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  selectedText: {
    color: Colors.blue.default,
  },
});


export default MenuGender;