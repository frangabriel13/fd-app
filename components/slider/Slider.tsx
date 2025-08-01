import sliderImages from '@/constants/Images';
import { Dimensions, Image, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');
const aspectRatio = 1920 / 750;

const Slider = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={sliderImages.banner1}
        className='w-full rounded mb-2'
        style={{ height: width / aspectRatio }}
        resizeMode='cover'
      />
      <Image 
        source={sliderImages.banner2}
        className='w-full rounded mb-2'
        style={{ height: width / aspectRatio }}
        resizeMode='cover'
      />
      <Image 
        source={sliderImages.banner3}
        className='w-full rounded mb-2'
        style={{ height: width / aspectRatio }}
        resizeMode='cover'
      />
      <Image 
        source={sliderImages.banner4}
        className='w-full rounded mb-2'
        style={{ height: width / aspectRatio }}
        resizeMode='cover'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
});


export default Slider;