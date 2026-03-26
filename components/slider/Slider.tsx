import Images from '@/constants/Images';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');
const SLIDER_HORIZONTAL_MARGIN = 8;
const SLIDER_WIDTH = width - SLIDER_HORIZONTAL_MARGIN * 2;
const aspectRatio = 1920 / 750;

const images = [
  Images.sliderImages.banner1,
  Images.sliderImages.banner2,
  Images.sliderImages.banner3,
  Images.sliderImages.banner4,
];

const loopedImages = [images[images.length - 1], ...images, images[0]];

const Slider = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(1);

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: width, animated: false });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = currentIndex + 1;
      scrollRef.current?.scrollTo({ x: width * nextIndex, animated: true });
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / width);

      if (index === 0) {
        scrollRef.current?.scrollTo({ x: width * images.length, animated: false });
        setCurrentIndex(images.length);
      } else if (index === images.length + 1) {
        scrollRef.current?.scrollTo({ x: width, animated: false });
        setCurrentIndex(1);
      } else {
        setCurrentIndex(index);
      }
    },
    []
  );

  const handleDotPress = (dotIndex: number) => {
    const scrollIndex = dotIndex + 1;
    scrollRef.current?.scrollTo({ x: width * scrollIndex, animated: true });
    setCurrentIndex(scrollIndex);
  };

  // Real index is 0-based for dots display
  const realIndex = ((currentIndex - 1) % images.length + images.length) % images.length;

  return (
    <View style={styles.sliderWrapper}>
      <View style={styles.sliderContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          contentOffset={{ x: width, y: 0 }}
        >
          {loopedImages.map((img, idx) => (
            <View key={idx} style={styles.slide}>
              <Image
                source={img}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>

        {/* Pagination dots */}
        <View style={styles.pagination}>
          {images.map((_, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handleDotPress(idx)}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <View
                style={[
                  styles.dot,
                  idx === realIndex && styles.dotActive,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderWrapper: {
    paddingHorizontal: SLIDER_HORIZONTAL_MARGIN,
    paddingTop: 8,
    paddingBottom: 4,
  },
  sliderContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  slide: {
    width: width,
  },
  image: {
    width: width,
    height: width / aspectRatio,
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  dotActive: {
    width: 20,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
});

export default Slider;
