import Images from '@/constants/Images';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';

const logoDefault = Images.defaultImages.logoDefault;

const gendersData = [
  { id: 'hombre', name: 'Hombre' },
  { id: 'mujer', name: 'Mujer' },
  { id: 'nino', name: 'Niño' },
  { id: 'nina', name: 'Niña' },
  { id: 'bebe', name: 'Bebé' },
];

const Genders = () => {
  const handleGenderPress = (gender) => {
    Alert.alert('Género seleccionado', `Has seleccionado: ${gender.name}`);
    console.log('Género seleccionado:', gender);
  };

  return (
    <View style={styles.container}>
      <View style={styles.gendersGrid}>
        {gendersData.map((gender) => (
          <TouchableOpacity
            key={gender.id}
            style={styles.genderCard}
            onPress={() => handleGenderPress(gender)}
            activeOpacity={0.7}
          >
            <Image 
              source={logoDefault} 
              style={styles.genderImage}
              resizeMode="contain"
            />
            <Text style={styles.genderText}>{gender.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  gendersGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  genderCard: {
    width: '18%', // Para que quepan 5 elementos con espacios
    aspectRatio: 1, // Mantiene la forma cuadrada
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  genderImage: {
    width: '80%',
    height: '70%',
  },
  genderText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    marginTop: 2,
  },
});

export default Genders;