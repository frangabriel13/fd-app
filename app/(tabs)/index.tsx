import Slider from '@/components/slider/Slider';
import Genders from '@/components/home/Genders';
import { StyleSheet, View } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Slider />
      <Genders />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,                    // ESENCIAL: Ocupa todo el espacio disponible
    // backgroundColor: '#fff',
    // paddingHorizontal: 10,
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
});


export default HomeScreen;