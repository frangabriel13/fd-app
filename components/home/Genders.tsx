import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { genders } from '@/utils/hardcode';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTAINER_PADDING = 12;
const GAP = 6;
const ITEM_WIDTH = (SCREEN_WIDTH - 16 - CONTAINER_PADDING * 2 - GAP * 4) / 5;
const ITEM_HEIGHT = ITEM_WIDTH * 1.2;

const Genders = () => {
  const gendersData = genders.filter(gender => gender.name !== 'Más');

  const handleGenderPress = (gender: any) => {
    router.push(`/(tabs)/tienda?genderId=${gender.id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {gendersData.map((gender) => (
          <TouchableOpacity
            key={gender.id}
            style={styles.genderItem}
            onPress={() => handleGenderPress(gender)}
            activeOpacity={0.8}
          >
            <View style={styles.card}>
              <Image
                source={{ uri: gender.url }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.label} numberOfLines={1}>{gender.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: CONTAINER_PADDING,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: GAP,
  },
  genderItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
  },
  card: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default Genders;
