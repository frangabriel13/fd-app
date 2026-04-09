import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface GalleryProps {
  images?: string[];
  mainImage?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onShare?: () => void;
}

const { width: SCREEN_W } = Dimensions.get('window');
const GALLERY_H = 380;

const Gallery = ({ images = [], mainImage, isFavorite, onToggleFavorite, onShare }: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Imagen principal al comienzo, sin duplicados
  const allImages = mainImage
    ? [mainImage, ...images.filter(img => img !== mainImage)]
    : images;

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_W);
    setCurrentIndex(index);
  };

  if (allImages.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <Image
            source={require('@/assets/images/logo-default.png')}
            style={styles.placeholderImage}
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
      >
        {allImages.map((uri, index) => (
          <View key={index} style={styles.slide}>
            <Image
              source={{ uri }}
              style={styles.image}
              contentFit="contain"
              transition={200}
            />
          </View>
        ))}
      </ScrollView>

      {/* Pills indicadores */}
      {allImages.length > 1 && (
        <View style={styles.dotsRow}>
          {allImages.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentIndex ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>
      )}

      {/* Contador esquina superior izquierda */}
      {allImages.length > 1 && (
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>{currentIndex + 1} / {allImages.length}</Text>
        </View>
      )}

      {/* Íconos flotantes: compartir + favorito */}
      <View style={styles.actionsColumn}>
        <Pressable onPress={onToggleFavorite} hitSlop={8} android_ripple={{ color: 'rgba(0,0,0,0.08)', borderless: true }}>
          <View style={[styles.iconBox, isFavorite && styles.iconBoxFavoriteActive]}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? Colors.orange.dark : Colors.blue.dark}
            />
          </View>
        </Pressable>
        <Pressable onPress={onShare} hitSlop={8} android_ripple={{ color: 'rgba(0,0,0,0.08)', borderless: true }}>
          <View style={styles.iconBox}>
            <Ionicons name="share-social-outline" size={24} color={Colors.blue.dark} />
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: GALLERY_H,
    backgroundColor: '#fff',
  },
  slide: {
    width: SCREEN_W,
    height: GALLERY_H,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_W,
    height: GALLERY_H,
  },

  // Placeholder sin imagen
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray.light,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    opacity: 0.35,
  },

  // Indicadores tipo pill
  dotsRow: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    height: 5,
    borderRadius: 3,
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.blue.dark,
  },
  dotInactive: {
    width: 6,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },

  // Acciones flotantes
  actionsColumn: {
    position: 'absolute',
    top: 12,
    right: 12,
    gap: 10,
  },
  iconBox: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#e8edf5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  iconBoxFavoriteActive: {
    backgroundColor: Colors.orange.dark + '22',
  },

  // Contador
  counterBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  counterText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default Gallery;
