import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';

interface GalleryProps {
  images?: string[];
  mainImage?: string;
}

const { width: screenWidth } = Dimensions.get('window');

const Gallery = ({ images = [], mainImage }: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Combinar imagen principal con el resto de imágenes
  const allImages = mainImage ? [mainImage, ...images] : images;
  
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(currentIndex);
  };

  if (allImages.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholderContainer}>
          <Image
            style={styles.placeholderImage}
            source={{ uri: 'https://via.placeholder.com/400x300/E5E5E5/999999?text=Sin+Imagen' }}
            contentFit="contain"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {allImages.map((imageUri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              contentFit="contain"
              transition={200}
            />
          </View>
        ))}
      </ScrollView>
      
      {/* Indicadores de página */}
      {allImages.length > 1 && (
        <View style={styles.indicatorContainer}>
          {allImages.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.indicator,
                index === currentIndex ? styles.activeIndicator : styles.inactiveIndicator
              ]}
            />
          ))}
        </View>
      )}
      
      {/* Contador de imágenes */}
      {allImages.length > 1 && (
        <View style={styles.counterContainer}>
          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {currentIndex + 1}/{allImages.length}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    // backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    // width: screenWidth,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: screenWidth - 20,
    height: 280,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  placeholderImage: {
    width: screenWidth - 20,
    height: 280,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#007AFF',
  },
  inactiveIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  counterContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  counter: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  counterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default Gallery;