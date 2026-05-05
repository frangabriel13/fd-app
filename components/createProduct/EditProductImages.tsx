import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@/components/ui';
import { spacing } from '@/constants/Styles';
import { Colors } from '@/constants/Colors';
import { uploadImages } from '@/store/slices/imageSlice';
import { RootState } from '@/store';
import type { AppDispatch } from '@/store';

const { width: SCREEN_W } = Dimensions.get('window');
const CAROUSEL_H = 380;

interface ImageItem {
  id: number;
  url: string;
  isNew?: boolean;
}

interface EditProductImagesProps {
  visible: boolean;
  onClose: () => void;
  existingImages: { id: number; url: string }[];
  mainImage: string;
  isPremium: boolean;
  onSave: (payload: { finalImages: ImageItem[]; mainImage: string }) => void;
}

const EditProductImages: React.FC<EditProductImagesProps> = ({
  visible,
  onClose,
  existingImages,
  mainImage,
  isPremium,
  onSave,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isUploading, uploadProgress } = useSelector((state: RootState) => state.image);

  const [images, setImages] = useState<ImageItem[]>([]);
  const [currentMain, setCurrentMain] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(SCREEN_W);
  const scrollRef = useRef<ScrollView>(null);

  const MAX_IMAGES = isPremium ? 9 : 3;

  // Inicializar el estado solo cuando el modal se abre
  useEffect(() => {
    if (visible) {
      setImages(existingImages.map((img) => ({ id: img.id, url: img.url })));
      setCurrentMain(mainImage);
      setCurrentIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
        Alert.alert('Permisos necesarios', 'Necesitamos permisos para acceder a la cámara y galería de fotos.');
        return false;
      }
    }
    return true;
  };

  const uploadAndAppend = async (uris: string[]) => {
    if (uris.length === 0) return;
    try {
      const result = await dispatch(uploadImages(uris)).unwrap();
      const newOnes: ImageItem[] = result.map((img) => ({
        id: img.id,
        url: img.url,
        isNew: true,
      }));
      setImages((prev) => {
        const merged = [...prev, ...newOnes];
        // Si todavía no hay mainImage definida, asignar la primera del set
        if (!currentMain && merged.length > 0) {
          setCurrentMain(merged[0].url);
        }
        return merged;
      });
    } catch (error: any) {
      Alert.alert('Error', error || 'No se pudieron subir las imágenes. Intenta nuevamente.');
    }
  };

  const handleSelectFromGallery = async () => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      Alert.alert('Límite alcanzado', `Solo puedes tener hasta ${MAX_IMAGES} imágenes`);
      return;
    }
    const ok = await requestPermissions();
    if (!ok) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: remaining,
      });
      if (!result.canceled && result.assets.length > 0) {
        await uploadAndAppend(result.assets.map((a) => a.uri));
      }
    } catch (error) {
      console.error('Error al seleccionar imágenes:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleTakePhoto = async () => {
    if (images.length >= MAX_IMAGES) {
      Alert.alert('Límite alcanzado', `Solo puedes tener hasta ${MAX_IMAGES} imágenes`);
      return;
    }
    const ok = await requestPermissions();
    if (!ok) return;

    try {
      // Pequeño delay para asegurar que el ActivityResultLauncher esté registrado en Android
      if (Platform.OS === 'android') {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        await uploadAndAppend([result.assets[0].uri]);
      }
    } catch (error: any) {
      console.error('Error al tomar foto:', error);
      const msg = error?.message || '';
      Alert.alert(
        'Error',
        msg.includes('unregistered')
          ? 'Por favor, cierra y vuelve a abrir el selector de imágenes'
          : 'No se pudo tomar la foto'
      );
    }
  };

  const handleDeleteCurrent = () => {
    const target = images[currentIndex];
    if (!target) return;

    Alert.alert(
      '¿Eliminar imagen?',
      'La imagen se eliminará al guardar los cambios del producto.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const next = images.filter((_, i) => i !== currentIndex);
            setImages(next);
            // Si la imagen eliminada era la principal, reasignar a la primera disponible
            if (target.url === currentMain) {
              setCurrentMain(next.length > 0 ? next[0].url : '');
            }
            // Ajustar el índice si quedó fuera de rango
            const newIndex = Math.max(0, Math.min(currentIndex, next.length - 1));
            setCurrentIndex(newIndex);
            setTimeout(() => {
              scrollRef.current?.scrollTo({ x: newIndex * containerWidth, animated: false });
            }, 50);
          },
        },
      ]
    );
  };

  const handleSave = () => {
    if (images.length === 0) {
      Alert.alert('Sin imágenes', 'Debes tener al menos una imagen del producto');
      return;
    }
    if (!currentMain) {
      Alert.alert('Sin imagen principal', 'Selecciona una imagen como principal');
      return;
    }
    onSave({ finalImages: images, mainImage: currentMain });
    onClose();
  };

  const handleScroll = (event: any) => {
    if (containerWidth <= 0) return;
    const idx = Math.round(event.nativeEvent.contentOffset.x / containerWidth);
    if (idx !== currentIndex) setCurrentIndex(idx);
  };

  const canAddMore = images.length < MAX_IMAGES;
  const isBusy = isUploading;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
            <Typography variant="body" className="text-gray-600">
              Cancelar
            </Typography>
          </TouchableOpacity>
          <Typography variant="h3" className="text-gray-800 text-center flex-1">
            Fotos
          </Typography>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.headerBtn, images.length === 0 && styles.disabledButton]}
            disabled={images.length === 0}
          >
            <Typography
              variant="body"
              className={images.length > 0 ? 'text-blue-600 font-semibold' : 'text-gray-400'}
            >
              Listo
            </Typography>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Carrusel */}
          {images.length > 0 ? (
            <View style={styles.carouselSection}>
              <View
                style={styles.carouselContainer}
                onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
              >
                <ScrollView
                  ref={scrollRef}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                >
                  {images.map((img) => (
                    <View key={`${img.id}`} style={[styles.slide, { width: containerWidth }]}>
                      <Image
                        source={{ uri: img.url }}
                        style={styles.slideImage}
                        contentFit="contain"
                        transition={200}
                      />
                    </View>
                  ))}
                </ScrollView>

                {/* Contador */}
                {images.length > 1 && (
                  <View style={styles.counterBadge}>
                    <Typography variant="caption" className="text-white font-semibold">
                      {currentIndex + 1} / {images.length}
                    </Typography>
                  </View>
                )}

                {/* Botón eliminar flotante */}
                <TouchableOpacity
                  style={styles.deleteFloatingButton}
                  onPress={handleDeleteCurrent}
                  activeOpacity={0.8}
                >
                  <Typography variant="body" className="text-white font-bold">
                    ✕
                  </Typography>
                </TouchableOpacity>

                {/* Dots indicators */}
                {images.length > 1 && (
                  <View style={styles.dotsRow}>
                    {images.map((_, i) => (
                      <View
                        key={i}
                        style={[styles.dot, i === currentIndex ? styles.dotActive : styles.dotInactive]}
                      />
                    ))}
                  </View>
                )}
              </View>

            </View>
          ) : (
            <View style={styles.emptyCarousel}>
              <Typography variant="h1" className="text-gray-300 text-center mb-2">
                📸
              </Typography>
              <Typography variant="body" className="text-gray-500 text-center">
                Aún no hay imágenes
              </Typography>
              <Typography variant="caption" className="text-gray-400 text-center mt-1">
                Agregá fotos desde tu galería o sacá una con la cámara
              </Typography>
            </View>
          )}

          {/* Progreso de cantidad */}
          <View style={styles.progressContainer}>
            <Typography variant="caption" className="text-blue-600 font-semibold">
              {images.length} de {MAX_IMAGES} fotos
            </Typography>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(images.length / MAX_IMAGES) * 100}%` as `${number}%` },
                ]}
              />
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[
                styles.mlActionButton,
                styles.primaryAction,
                (!canAddMore || isBusy) && styles.disabledAction,
              ]}
              onPress={handleSelectFromGallery}
              disabled={!canAddMore || isBusy}
            >
              <View style={styles.actionIconContainer}>
                <Typography variant="h4" className="text-white">
                  📱
                </Typography>
              </View>
              <View style={styles.actionTextContainer}>
                <Typography variant="body" className="text-white font-semibold mb-1">
                  {isBusy ? `Subiendo ${Math.round(uploadProgress)}%...` : 'Elegir de galería'}
                </Typography>
                <Typography variant="caption" className="text-blue-100">
                  Seleccioná desde tu galería
                </Typography>
              </View>
              {isBusy && <ActivityIndicator color="#fff" size="small" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.mlActionButton,
                styles.secondaryAction,
                (!canAddMore || isBusy) && styles.disabledAction,
              ]}
              onPress={handleTakePhoto}
              disabled={!canAddMore || isBusy}
            >
              <View style={styles.actionIconContainer}>
                <Typography variant="h4" className="text-blue-600">
                  📷
                </Typography>
              </View>
              <View style={styles.actionTextContainer}>
                <Typography variant="body" className="text-blue-600 font-semibold mb-1">
                  {isBusy ? 'Subiendo...' : 'Sacar foto'}
                </Typography>
                <Typography variant="caption" className="text-blue-500">
                  Usá la cámara de tu teléfono
                </Typography>
              </View>
            </TouchableOpacity>

            {!canAddMore && (
              <View style={styles.limitInfo}>
                <Typography variant="caption" className="text-orange-700 text-center">
                  Llegaste al límite de {MAX_IMAGES} imágenes
                  {!isPremium ? '. Hacete Premium para subir hasta 9.' : '.'}
                </Typography>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerBtn: {
    paddingVertical: spacing.sm,
  },
  disabledButton: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
  carouselSection: {
    backgroundColor: '#fff',
    paddingBottom: spacing.md,
  },
  carouselContainer: {
    height: CAROUSEL_H,
    backgroundColor: Colors.gray.light,
    position: 'relative',
  },
  slide: {
    height: CAROUSEL_H,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  counterBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  deleteFloatingButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
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
  emptyCarousel: {
    height: CAROUSEL_H,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray.light,
    paddingHorizontal: spacing.lg,
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  progressBar: {
    width: 140,
    height: 4,
    backgroundColor: '#e3f2fd',
    borderRadius: 2,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.blue.light,
    borderRadius: 2,
  },
  actionsContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  mlActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryAction: {
    backgroundColor: Colors.blue.light,
  },
  secondaryAction: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: Colors.blue.light,
  },
  disabledAction: {
    opacity: 0.5,
  },
  actionIconContainer: {
    marginRight: spacing.md,
  },
  actionTextContainer: {
    flex: 1,
  },
  limitInfo: {
    backgroundColor: '#fff7ed',
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
});

export default EditProductImages;
