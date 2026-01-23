import React, { useState } from 'react';
import { 
  View, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Button } from '@/components/ui';
import { spacing, borderRadius } from '@/constants/Styles';
import { uploadImages, resetUploadState, clearUploadedImages } from '@/store/slices/imageSlice';
import { RootState } from '@/store';
import type { AppDispatch } from '@/store';

const { width: screenWidth } = Dimensions.get('window');

interface SelectImagesProps {
  visible: boolean;
  onClose: () => void;
  selectedImages: string[];
  onSelectionChange: (images: string[]) => void;
}

interface LocalImage {
  uri: string;
  id: string;
  uploaded: boolean;
  uploading: boolean;
}

const SelectImages: React.FC<SelectImagesProps> = ({
  visible,
  onClose,
  selectedImages,
  onSelectionChange
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { uploadedImages, isUploading, uploadError, uploadProgress } = useSelector(
    (state: RootState) => state.image
  );
  
  const [localImages, setLocalImages] = useState<LocalImage[]>([]);

  const MAX_IMAGES = 3;

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
        Alert.alert(
          'Permisos necesarios',
          'Necesitamos permisos para acceder a la cámara y galería de fotos.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const handleSelectFromGallery = async () => {
    if (localImages.length >= MAX_IMAGES) {
      Alert.alert('Límite alcanzado', 'Solo puedes seleccionar hasta 3 imágenes');
      return;
    }

    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4], // 900x1200 ratio
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        const newImage: LocalImage = {
          uri: result.assets[0].uri,
          id: Date.now().toString(),
          uploaded: false,
          uploading: false
        };
        setLocalImages(prev => [...prev, newImage]);
      }
    } catch (error) {
      console.error('Error selecting from gallery:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleTakePhoto = async () => {
    if (localImages.length >= MAX_IMAGES) {
      Alert.alert('Límite alcanzado', 'Solo puedes seleccionar hasta 3 imágenes');
      return;
    }

    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4], // 900x1200 ratio
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newImage: LocalImage = {
          uri: result.assets[0].uri,
          id: Date.now().toString(),
          uploaded: false,
          uploading: false
        };
        setLocalImages(prev => [...prev, newImage]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setLocalImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleUploadImages = async () => {
    if (localImages.length === 0) {
      Alert.alert('Sin imágenes', 'Selecciona al menos una imagen para subir');
      return;
    }

    try {
      // Marcar imágenes como "subiendo"
      const updatedImages = localImages.map(img => ({ ...img, uploading: true }));
      setLocalImages(updatedImages);

      // Obtener URIs de imágenes no subidas
      const imageUris = localImages
        .filter(img => !img.uploaded)
        .map(img => img.uri);

      if (imageUris.length > 0) {
        // Llamar al thunk de Redux con URIs
        const result = await dispatch(uploadImages(imageUris)).unwrap();
        
        // Marcar imágenes como subidas
        const successImages = localImages.map(img => ({
          ...img,
          uploaded: true,
          uploading: false
        }));
        setLocalImages(successImages);

        // Mostrar mensaje de éxito
        Alert.alert(
          '¡Éxito!',
          `Se subieron ${result.length} imágenes correctamente`,
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('Error al subir imágenes:', error);
      
      // Revertir estado de subida en caso de error
      const revertedImages = localImages.map(img => ({
        ...img,
        uploaded: false,
        uploading: false
      }));
      setLocalImages(revertedImages);
      
      Alert.alert(
        'Error',
        error || 'No se pudieron subir las imágenes. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleClose = () => {
    // Limpiar estado local
    setLocalImages([]);
    // Limpiar estado de Redux si hay errores
    if (uploadError) {
      dispatch(resetUploadState());
    }
    onClose();
  };

  const handleSave = () => {
    // Si hay imágenes en el store de Redux, usarlas
    if (uploadedImages.length > 0) {
      const imageUrls = uploadedImages.map(img => img.url);
      onSelectionChange(imageUrls);
    } else {
      // Fallback a imágenes locales subidas
      const uploadedImageUrls = localImages
        .filter(img => img.uploaded)
        .map(img => img.uri);
      onSelectionChange(uploadedImageUrls);
    }
    
    // Limpiar estado al cerrar
    dispatch(clearUploadedImages());
    onClose();
  };

  const canUpload = localImages.some(img => !img.uploaded) && !isUploading;
  const allUploaded = (localImages.length > 0 && localImages.every(img => img.uploaded)) || uploadedImages.length > 0;
  const hasLocalImages = localImages.length > 0;
  const totalImages = uploadedImages.length > 0 ? uploadedImages.length : localImages.length;
  const isDisabled = isUploading; // Deshabilitar acciones durante la subida

  const renderImagePreview = (image: LocalImage, index: number) => {
    return (
      <View key={image.id} style={styles.imageContainer}>
        <Image source={{ uri: image.uri }} style={styles.imagePreview} />
        
        {/* Remove button */}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveImage(image.id)}
        >
          <Typography variant="caption" className="text-white font-bold">
            ✕
          </Typography>
        </TouchableOpacity>

        {/* Status indicator */}
        <View style={styles.statusContainer}>
          {image.uploading || isUploading ? (
            <View style={[styles.statusBadge, styles.uploadingBadge]}>
              <Typography variant="caption" className="text-blue-700 font-semibold text-xs">
                {isUploading && uploadProgress > 0 
                  ? `${Math.round(uploadProgress)}%` 
                  : 'Subiendo...'}
              </Typography>
            </View>
          ) : image.uploaded ? (
            <View style={[styles.statusBadge, styles.uploadedBadge]}>
              <Typography variant="caption" className="text-green-700 font-semibold text-xs">
                ✓ Subido
              </Typography>
            </View>
          ) : (
            <View style={[styles.statusBadge, styles.pendingBadge]}>
              <Typography variant="caption" className="text-orange-700 font-semibold text-xs">
                Pendiente
              </Typography>
            </View>
          )}
        </View>

        {/* Image number */}
        <View style={styles.imageNumber}>
          <Typography variant="caption" className="text-white font-bold">
            {index + 1}
          </Typography>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Typography variant="body" className="text-gray-600">
              Cancelar
            </Typography>
          </TouchableOpacity>
          
          <Typography variant="h3" className="text-gray-800 text-center flex-1">
            Fotos
          </Typography>
          
          <TouchableOpacity 
            onPress={handleSave} 
            style={[styles.saveButton, !allUploaded && styles.disabledButton]}
            disabled={!allUploaded}
          >
            <Typography variant="body" className={allUploaded ? "text-blue-600 font-semibold" : "text-gray-400"}>
              Listo
            </Typography>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Hero Section - Estilo MercadoLibre */}
          <View style={styles.heroSection}>
            <View style={styles.heroIcon}>
              <Typography variant="h1" className="text-blue-500 text-center">
                📸
              </Typography>
            </View>
            <Typography variant="h3" className="text-gray-800 text-center mb-2">
              Agregá fotos a tu publicación
            </Typography>
            <View style={styles.progressContainer}>
              <Typography variant="caption" className="text-blue-600 font-semibold">
                {totalImages} de {MAX_IMAGES} fotos
              </Typography>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: ((totalImages / MAX_IMAGES) * 100) + '%' }
                  ]} 
                />
              </View>
            </View>
          </View>

          {/* Action Buttons - Estilo MercadoLibre */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.mlActionButton, styles.primaryAction, (localImages.length >= MAX_IMAGES || isDisabled) && styles.disabledAction]}
              onPress={handleSelectFromGallery}
              disabled={localImages.length >= MAX_IMAGES || isDisabled}
            >
              <View style={styles.actionIconContainer}>
                <Typography variant="h4" className="text-white mb-1">
                  📱
                </Typography>
              </View>
              <View style={styles.actionTextContainer}>
                <Typography variant="h4" className="text-white font-semibold mb-1">
                  {isDisabled ? 'Subiendo...' : 'Elegir de galería'}
                </Typography>
                <Typography variant="caption" className="text-blue-100">
                  {isDisabled ? 'Espera un momento' : 'Seleccioná desde tu galería'}
                </Typography>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.mlActionButton, styles.secondaryAction, (localImages.length >= MAX_IMAGES || isDisabled) && styles.disabledAction]}
              onPress={handleTakePhoto}
              disabled={localImages.length >= MAX_IMAGES || isDisabled}
            >
              <View style={styles.actionIconContainer}>
                <Typography variant="h4" className="text-blue-600 mb-1">
                  📷
                </Typography>
              </View>
              <View style={styles.actionTextContainer}>
                <Typography variant="h4" className="text-blue-600 font-semibold mb-1">
                  {isDisabled ? 'Subiendo...' : 'Sacar foto'}
                </Typography>
                <Typography variant="caption" className="text-blue-500">
                  {isDisabled ? 'Espera un momento' : 'Usá la cámara de tu teléfono'}
                </Typography>
              </View>
            </TouchableOpacity>
          </View>

          {/* Selected Images */}
          {localImages.length > 0 && (
            <View style={styles.imagesSection}>
              <Typography variant="h4" className="text-gray-700 mb-4">
                Imágenes seleccionadas
              </Typography>
              
              <View style={styles.imagesGrid}>
                {localImages.map((image, index) => renderImagePreview(image, index))}
              </View>

              {/* Upload Button */}
              {canUpload && (
                <Button
                  variant="secondary"
                  onPress={handleUploadImages}
                  style={styles.uploadButton}
                  disabled={isUploading}
                >
                  <Typography variant="body" className="font-semibold">
                    {isUploading ? '⏳ Subiendo...' : '☁️ Subir imágenes'}
                  </Typography>
                </Button>
              )}
              
              {/* Error Message */}
              {uploadError && (
                <View style={styles.errorContainer}>
                  <Typography variant="caption" className="text-red-600 text-center">
                    ❌ {uploadError}
                  </Typography>
                </View>
              )}

              {/* Success Message */}
              {uploadedImages.length > 0 && (
                <View style={styles.successContainer}>
                  <Typography variant="caption" className="text-green-600 text-center">
                    ✅ {uploadedImages.length} imagen(es) subida(s) exitosamente
                  </Typography>
                </View>
              )}

              {/* Upload Status */}
              {/* {localImages.length > 0 && (
                <View style={styles.statusSection}>
                  <View style={styles.statusRow}>
                    <View style={styles.statusItem}>
                      <View style={[styles.statusDot, styles.pendingDot]} />
                      <Typography variant="caption" className="text-gray-600">
                        Pendiente: {localImages.filter(img => !img.uploaded && !img.uploading).length}
                      </Typography>
                    </View>
                    <View style={styles.statusItem}>
                      <View style={[styles.statusDot, styles.uploadedDot]} />
                      <Typography variant="caption" className="text-gray-600">
                        Subido: {localImages.filter(img => img.uploaded).length}
                      </Typography>
                    </View>
                  </View>
                </View>
              )} */}
            </View>
          )}

          {/* Empty State */}
          {localImages.length === 0 && (
            <View style={styles.emptyState}>
              <Typography variant="h2" className="text-gray-400 text-center mb-2">
                📷
              </Typography>
              <Typography variant="body" className="text-gray-500 text-center mb-2">
                No has seleccionado imágenes
              </Typography>
              <Typography variant="caption" className="text-gray-400 text-center">
                Usa los botones de arriba para agregar fotos de tu producto
              </Typography>
            </View>
          )}
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
  closeButton: {
    paddingVertical: spacing.sm,
  },
  saveButton: {
    paddingVertical: spacing.sm,
  },
  disabledButton: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  // Nuevo: Hero Section estilo MercadoLibre
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: spacing.lg,
  },
  heroIcon: {
    marginBottom: spacing.lg,
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  progressBar: {
    width: 120,
    height: 4,
    backgroundColor: '#e3f2fd',
    borderRadius: 2,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196f3',
    borderRadius: 2,
  },
  // Nuevo: Action Buttons estilo MercadoLibre
  actionsContainer: {
    marginBottom: spacing.xl,
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
    backgroundColor: '#2196f3',
  },
  secondaryAction: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#2196f3',
  },
  disabledAction: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
    opacity: 0.6,
  },
  actionIconContainer: {
    marginRight: spacing.md,
  },
  actionTextContainer: {
    flex: 1,
  },
  // Resto de estilos actualizados
  imagesSection: {
    marginBottom: spacing.xl,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  imageContainer: {
    position: 'relative',
    width: (screenWidth - spacing.lg * 2 - spacing.md * 2) / 3,
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  uploadingBadge: {
    backgroundColor: '#e3f2fd',
  },
  uploadedBadge: {
    backgroundColor: '#e8f5e8',
  },
  pendingBadge: {
    backgroundColor: '#fff3e0',
  },
  imageNumber: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#2196f3',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    marginBottom: spacing.md,
    backgroundColor: '#2196f3',
    borderRadius: 8,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: '#fecaca',
    marginBottom: spacing.md,
  },
  successContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    marginBottom: spacing.md,
  },
  statusSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pendingDot: {
    backgroundColor: '#ff9800',
  },
  uploadedDot: {
    backgroundColor: '#4caf50',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
});

export default SelectImages;