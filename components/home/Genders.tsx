import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { genders } from '@/utils/hardcode';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTAINER_PADDING = 12;
const GAP = 8;
const ITEM_SIZE = (SCREEN_WIDTH - 16 - CONTAINER_PADDING * 2 - GAP * 4) / 5;

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
            activeOpacity={0.7}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: gender.url }}
                style={styles.genderImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.genderText} numberOfLines={1}>{gender.name}</Text>
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
    width: ITEM_SIZE,
    alignItems: 'center',
  },
  imageWrapper: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#021344',
    backgroundColor: '#f3f4f6',
  },
  genderImage: {
    width: '100%',
    height: '100%',
  },
  genderText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    color: '#4b5563',
    marginTop: 5,
  },
});

export default Genders;
