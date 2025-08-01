import sliderImages from '@/constants/Images';
import { Dimensions, Image, ScrollView, View } from 'react-native';

const { width } = Dimensions.get('window');
const aspectRatio = 1920 / 750;

const images = [
  sliderImages.banner1,
  sliderImages.banner2,
  sliderImages.banner3,
  sliderImages.banner4,
];

const Slider = () => {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      className="w-full"
    >
      {images.map((img, idx) => (
        <View key={idx} style={{ width }}>
          <Image
            source={img}
            className="w-full rounded mb-2"
            style={{ height: width / aspectRatio, width: width }}
            resizeMode="cover" 
          />
        </View>
      ))}
    </ScrollView>
  );
};


export default Slider;