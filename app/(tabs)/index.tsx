import Slider from '@/components/slider/Slider';
import Genders from '@/components/home/Genders';
import LiveManufacturers from '@/components/home/LiveManufacturers';
import ProductSlider from '@/components/home/ProductSlider';
import { StyleSheet, ScrollView, View } from 'react-native';

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Slider />
      <View style={styles.homeContent}>  
        <Genders />
        <LiveManufacturers />
        <ProductSlider />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  homeContent: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
});


export default HomeScreen;