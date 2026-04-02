import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { genders } from '@/utils/hardcode';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Mostramos 4 cards con un pequeño peek del siguiente
const CARD_WIDTH = (SCREEN_WIDTH - 16 - 10 * 3) / 4.25;
const CARD_HEIGHT = CARD_WIDTH * 1.55;

type GenderCardProps = {
  gender: (typeof genders)[number];
  onPress: () => void;
};

const GenderCard = ({ gender, onPress }: GenderCardProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.94, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <Image
          source={{ uri: gender.url }}
          style={styles.cardImage}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.cardLabel}>
          <Text style={styles.cardText}>{gender.name}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const Genders = () => {
  const gendersData = genders.filter(gender => gender.name !== 'Más');

  const handleGenderPress = (gender: (typeof genders)[number]) => {
    router.push(`/(tabs)/tienda?genderId=${gender.id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorar</Text>
        <View style={styles.titleAccent} />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 10}
        snapToAlignment="start"
      >
        {gendersData.map((gender) => (
          <GenderCard
            key={gender.id}
            gender={gender}
            onPress={() => handleGenderPress(gender)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingTop: 14,
    paddingBottom: 16,
  },
  header: {
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#021344',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  titleAccent: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#f3f4f6',
  },
  scrollContent: {
    paddingHorizontal: 14,
    gap: 10,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '27.5%',
    justifyContent: 'flex-end',
    paddingBottom: 10,
    paddingHorizontal: 8,
    // Gradiente simulado con opacidad
    backgroundColor: 'rgba(2, 19, 68, 0.52)',
  },
  cardText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export default Genders;
