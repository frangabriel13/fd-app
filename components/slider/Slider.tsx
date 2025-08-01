import sliderImages from '@/constants/Images';
import { Image, StyleSheet, View } from 'react-native';

const Slider = () => {
  return (
    <View style={styles.container}>
      <Image source={sliderImages.banner1} />
      <Image source={sliderImages.banner2} />
      <Image source={sliderImages.banner3} />
      <Image source={sliderImages.banner4} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
});


export default Slider;