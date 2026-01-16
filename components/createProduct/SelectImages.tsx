import React, { useState } from 'react';
import { 
  View, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Alert,
  Dimensions
} from 'react-native';
import { Typography, Button } from '@/components/ui';
import { spacing, borderRadius } from '@/constants/Styles';

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
  const [localImages, setLocalImages] = useState<LocalImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const MAX_IMAGES = 3;

  const handleSelectFromGallery = () => {
    // TODO: Implementar selección de galería
    console.log('Seleccionar de galería');
    // Simulando selección de imagen
    if (localImages.length < MAX_IMAGES) {
      const newImage: LocalImage = {
        uri: `https://picsum.photos/900/1200?random=${Date.now()}`,
        id: Date.now().toString(),
        uploaded: false,
        uploading: false
      };
      setLocalImages(prev => [...prev, newImage]);
    } else {
      Alert.alert('Límite alcanzado', 'Solo puedes seleccionar hasta 3 imágenes');
    }
  };

  const handleTakePhoto = () => {
    // TODO: Implementar cámara
    console.log('Tomar foto');
    if (localImages.length < MAX_IMAGES) {
      const newImage: LocalImage = {
        uri: `https://picsum.photos/900/1200?random=${Date.now() + 1}`,
        id: (Date.now() + 1).toString(),
        uploaded: false,
        uploading: false
      };
      setLocalImages(prev => [...prev, newImage]);
    } else {
      Alert.alert('Límite alcanzado', 'Solo puedes seleccionar hasta 3 imágenes');
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setLocalImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleUploadImages = async () => {
    // TODO: Implementar subida a AWS
    console.log('Subir imágenes a AWS');
    setIsUploading(true);
    
    // Simular proceso de subida
    const updatedImages = localImages.map(img => ({ ...img, uploading: !img.uploaded }));
    setLocalImages(updatedImages);
    
    setTimeout(() => {
      const uploadedImages = localImages.map(img => ({ ...img, uploaded: true, uploading: false }));
      setLocalImages(uploadedImages);
      setIsUploading(false);
    }, 2000);
  };

  const handleSave = () => {
    const uploadedImageUrls = localImages
      .filter(img => img.uploaded)
      .map(img => img.uri);
    onSelectionChange(uploadedImageUrls);
    onClose();
  };

  const canUpload = localImages.some(img => !img.uploaded) && !isUploading;
  const allUploaded = localImages.length > 0 && localImages.every(img => img.uploaded);

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
          {image.uploading ? (
            <View style={[styles.statusBadge, styles.uploadingBadge]}>
              <Typography variant="caption" className="text-blue-700 font-semibold text-xs">
                Subiendo...
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
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Typography variant="body" className="text-gray-500">
              Cancelar
            </Typography>
          </TouchableOpacity>
          
          <Typography variant="h3" className="text-gray-800 text-center flex-1">
            Seleccionar imágenes
          </Typography>
          
          <TouchableOpacity 
            onPress={handleSave} 
            style={[styles.saveButton, !allUploaded && styles.disabledButton]}
            disabled={!allUploaded}
          >
            <Typography variant="body" className={allUploaded ? "text-orange-500 font-semibold" : "text-gray-400"}>
              Guardar
            </Typography>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Info Section */}
          <View style={styles.infoSection}>
            <Typography variant="h4" className="text-gray-700 mb-2">
              📷 Agregar imágenes del producto
            </Typography>
            <Typography variant="body2" className="text-gray-600 mb-4">
              Selecciona hasta {MAX_IMAGES} imágenes (900x1200px). Las imágenes deben subirse a AWS antes de guardar.
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              {localImages.length}/{MAX_IMAGES} imágenes seleccionadas
            </Typography>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={[styles.actionButton, localImages.length >= MAX_IMAGES && styles.disabledActionButton]}
              onPress={handleSelectFromGallery}
              disabled={localImages.length >= MAX_IMAGES}
            >
              <Typography variant="body" className="text-white font-semibold mb-1">
                📱 Seleccionar de galería
              </Typography>
              <Typography variant="caption" className="text-white opacity-80">
                Elige fotos existentes
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, localImages.length >= MAX_IMAGES && styles.disabledActionButton]}
              onPress={handleTakePhoto}
              disabled={localImages.length >= MAX_IMAGES}
            >
              <Typography variant="body" className="text-white font-semibold mb-1">
                📸 Tomar foto
              </Typography>
              <Typography variant="caption" className="text-white opacity-80">
                Captura una nueva imagen
              </Typography>
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
                    {isUploading ? '⏳ Subiendo...' : '☁️ Subir a AWS'}
                  </Typography>
                </Button>
              )}

              {/* Upload Status */}
              {localImages.length > 0 && (
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
              )}
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
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
  infoSection: {
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: spacing.lg,
  },
  actionsSection: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f97316',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledActionButton: {
    backgroundColor: '#d1d5db',
    opacity: 0.6,
  },
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
    height: 120,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    position: 'absolute',
    bottom: spacing.xs,
    left: spacing.xs,
    right: spacing.xs,
  },
  statusBadge: {
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  uploadingBadge: {
    backgroundColor: '#dbeafe',
  },
  uploadedBadge: {
    backgroundColor: '#d1fae5',
  },
  pendingBadge: {
    backgroundColor: '#fed7aa',
  },
  imageNumber: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    marginBottom: spacing.md,
  },
  statusSection: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    backgroundColor: '#f97316',
  },
  uploadedDot: {
    backgroundColor: '#10b981',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
});

export default SelectImages;