import sliderImages from '@/constants/Images';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');
const aspectRatio = 1920 / 750;

const images = [
  sliderImages.banner1,
  sliderImages.banner2,
  sliderImages.banner3,
  sliderImages.banner4,
];

const loopedImages = [images[images.length - 1], ...images, images[0]];

const Slider = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(1);

  useEffect(() => {
    // Al montar, posiciona en la primera imagen real
    scrollRef.current?.scrollTo({ x: width, animated: false });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      scrollRef.current?.scrollTo({ x: width * nextIndex, animated: true });
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    let offsetX = e.nativeEvent.contentOffset.x;
    let index = Math.round(offsetX / width);

    if (index === 0) {
      // Si está en la imagen clonada al inicio, salta a la última real
      scrollRef.current?.scrollTo({ x: width * images.length, animated: false });
      setCurrentIndex(images.length);
    } else if (index === images.length + 1) {
      // Si está en la imagen clonada al final, salta a la primera real
      scrollRef.current?.scrollTo({ x: width, animated: false });
      setCurrentIndex(1);
    } else {
      setCurrentIndex(index);
    }
  };
        

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      className="w-full"
      onMomentumScrollEnd={onMomentumScrollEnd}
      contentOffset={{ x: width, y: 0 }}
    >
      {loopedImages.map((img, idx) => (
        <View key={idx} style={styles.slide}>
          <Image
            source={img}
            className="w-full mb-2"
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  slide: {
    width: width,
  },
  image: {
    width: width,
    height: width / aspectRatio,
  },
});


export default Slider;
// import sliderImages from '@/constants/Images';
// import { useEffect, useRef, useState } from 'react';
// import {
//   Dimensions,
//   Image,
//   NativeScrollEvent,
//   NativeSyntheticEvent,
//   ScrollView,
//   StyleSheet,
//   View,
// } from 'react-native';

// const { width } = Dimensions.get('window');
// const slideWidth = width * 0.8;
// const sideSpacing = (width - slideWidth) / 2;
// const aspectRatio = 1920 / 750;

// const images = [
//   sliderImages.banner1,
//   sliderImages.banner2,
//   sliderImages.banner3,
//   sliderImages.banner4,
// ];

// const loopedImages = [images[images.length - 1], ...images, images[0]];

// const Slider = () => {
//   const scrollRef = useRef<ScrollView>(null);
//   const [currentIndex, setCurrentIndex] = useState(1);

//   useEffect(() => {
//     scrollRef.current?.scrollTo({ x: slideWidth * currentIndex, animated: false });
//   }, [currentIndex]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       let nextIndex = currentIndex + 1;
//       scrollRef.current?.scrollTo({ x: slideWidth * nextIndex, animated: true });
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [currentIndex]);

//   const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const offsetX = e.nativeEvent.contentOffset.x;
//     const index = Math.round(offsetX / slideWidth);

//     if (index === 0) {
//       scrollRef.current?.scrollTo({ x: slideWidth * images.length, animated: false });
//       setCurrentIndex(images.length);
//     } else if (index === images.length + 1) {
//       scrollRef.current?.scrollTo({ x: slideWidth, animated: false });
//       setCurrentIndex(1);
//     } else {
//       setCurrentIndex(index);
//     }
//   };

//   return (
//     <ScrollView
//       ref={scrollRef}
//       horizontal
//       showsHorizontalScrollIndicator={false}
//       snapToInterval={slideWidth}
//       decelerationRate="fast"
//       onMomentumScrollEnd={onMomentumScrollEnd}
//       contentContainerStyle={{
//         paddingHorizontal: sideSpacing,
//       }}
//       contentOffset={{ x: slideWidth, y: 0 }}
//     >
//       {loopedImages.map((img, idx) => (
//         <View key={idx} style={styles.slide}>
//           <Image
//             source={img}
//             style={styles.image}
//             resizeMode="cover"
//           />
//         </View>
//       ))}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   slide: {
//     width: slideWidth,
//   },
//   image: {
//     width: '100%',
//     height: slideWidth / aspectRatio,
//     borderRadius: 10,
//   },
// });

// export default Slider;
