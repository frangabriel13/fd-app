import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { genders } from '@/utils/hardcode';

const Genders = () => {
  // Filtrar para excluir "Más" (id: 7)
  const gendersData = genders.filter(gender => gender.id !== 7);

  const handleGenderPress = (gender) => {
    // Navegar a la tienda con el género seleccionado
    router.push(`/(tabs)/tienda?genderId=${gender.id}`);
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
              source={{ uri: gender.url }} 
              style={styles.genderImage}
              resizeMode="cover"
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
    paddingHorizontal: 4,
  },
  gendersGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 1,
  },
  genderCard: {
    width: '18%', // Para que quepan 5 elementos con espacios
    aspectRatio: 1, // Mantiene la forma cuadrada
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  genderImage: {
    width: '100%',
    height: '100%',
  },
  genderText: {
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 4,
    paddingHorizontal: 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    textTransform: 'uppercase',
  },
});

export default Genders;