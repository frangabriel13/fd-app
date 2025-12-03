import { View, Text, StyleSheet } from 'react-native';

interface GalleryProps {
  images?: string[];
  mainImage?: string;
}

const Gallery = ({ images, mainImage }: GalleryProps) => {
  return (
    <View style={styles.container}>
      <Text>Gallery</Text>
      {mainImage && <Text>Imagen principal: {mainImage}</Text>}
      {images && <Text>Total de imágenes: {images.length}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
});


export default Gallery;