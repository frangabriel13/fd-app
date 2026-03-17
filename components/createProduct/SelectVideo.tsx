import { useState, useEffect, useCallback } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Video, ResizeMode } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Typography, Button } from '@/components/ui';
import { spacing } from '@/constants/Styles';
import { uploadProductVideo, resetUploadVideoState, deleteProductVideo, resetDeleteVideoState } from '@/store/slices/productSlice';
import type { AppDispatch, RootState } from '@/store';

interface SelectVideoProps {
  visible: boolean;
  onClose: () => void;
  productId: string;
  videoUrl?: string | null;
}

const SelectVideo = ({ visible, onClose, productId, videoUrl }: SelectVideoProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    uploadingVideo, 
    uploadVideoError, 
    uploadedVideoUrl, 
    isDeletingVideo, 
    deleteVideoError 
  } = useSelector((state: RootState) => state.product);
  
  const [selectedVideo, setSelectedVideo] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleClose = useCallback(() => {
    setSelectedVideo(null);
    setIsReady(false);
    dispatch(resetUploadVideoState());
    dispatch(resetDeleteVideoState());
    onClose();
  }, [dispatch, onClose]);

  useEffect(() => {
    if (uploadedVideoUrl) {
      Alert.alert(
        'Éxito',
        'Video subido correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              handleClose();
            }
          }
        ]
      );
    }
  }, [uploadedVideoUrl, handleClose]);

  useEffect(() => {
    if (uploadVideoError) {
      Alert.alert('Error', uploadVideoError);
    }
  }, [uploadVideoError]);

  useEffect(() => {
    if (deleteVideoError) {
      Alert.alert('Error', deleteVideoError);
    }
  }, [deleteVideoError]);

  const handleSelectFromGallery = async () => {
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Necesitamos permisos para acceder a tu galería'
        );
        return;
      }

      // Abrir selector de video
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 15, // 15 segundos máximo
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const video = result.assets[0];
        
        // Validar duración del video
        if (video.duration && video.duration > 15000) {
          Alert.alert(
            'Video muy largo',
            'El video no puede durar más de 15 segundos'
          );
          return;
        }

        setSelectedVideo(video);
        setIsReady(true);
      }
    } catch (error: any) {
      console.error('Error al seleccionar video:', error);
      Alert.alert('Error', 'No se pudo seleccionar el video');
    }
  };

  const handleUploadVideo = async () => {
    if (!selectedVideo) {
      Alert.alert('Error', 'No hay video seleccionado');
      return;
    }

    if (!productId) {
      Alert.alert('Error', 'No se encontró el ID del producto');
      return;
    }

    try {
      // Crear el objeto File para React Native
      const videoFile: any = {
        uri: selectedVideo.uri,
        type: 'video/mp4',
        name: `video-${Date.now()}.mp4`,
      };

      await dispatch(uploadProductVideo({ 
        productId, 
        videoFile 
      })).unwrap();
    } catch (error: any) {
      console.error('Error al subir video:', error);
      Alert.alert('Error', error || 'No se pudo subir el video');
    }
  };

  const handleDeleteVideo = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteVideo = async () => {
    setShowDeleteConfirm(false);
    
    if (!productId) {
      Alert.alert('Error', 'No se encontró el ID del producto');
      return;
    }

    try {
      await dispatch(deleteProductVideo(productId)).unwrap();
      Alert.alert(
        'Éxito',
        'Video eliminado correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              handleClose();
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Error al eliminar video:', error);
      Alert.alert('Error', error || 'No se pudo eliminar el video');
    }
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
            Video
          </Typography>
          
          <TouchableOpacity 
            onPress={handleClose} 
            style={[styles.saveButton, !isReady && styles.disabledButton]}
            disabled={!isReady}
          >
            <Typography variant="body" className={isReady ? "text-orange-500" : "text-gray-400"}>
              Listo
            </Typography>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroIcon}>
              <Typography variant="h1" className="text-orange-500 text-center">
                🎥
              </Typography>
            </View>
            <Typography variant="h3" className="text-gray-800 text-center mb-2">
              Agrega un video a tu publicación
            </Typography>
            <Typography variant="body" className="text-gray-500 text-center mb-1">
              (video de 15 segundos máximo)
            </Typography>
            <View style={styles.premiumBadge}>
              <Typography variant="caption" className="text-orange-600 font-semibold">
                ⭐ Exclusivo para suscriptores Premium
              </Typography>
            </View>
          </View>

          {/* Action Button */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryAction]}
              onPress={handleSelectFromGallery}
            >
              <View style={styles.actionIconContainer}>
                <Typography variant="h3" className="text-white mb-1">
                  📱
                </Typography>
              </View>
              <View style={styles.actionTextContainer}>
                <Typography variant="body" className="text-white font-semibold mb-1">
                  Elegir de galería
                </Typography>
                <Typography variant="caption" className="text-orange-100">
                  Selecciona un video desde tu galería
                </Typography>
              </View>
            </TouchableOpacity>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Typography variant="caption" className="text-gray-600 text-center">
                ℹ️ Solo se puede cargar video de la galería. No puedes filmar el producto en el momento.
              </Typography>
            </View>
          </View>

          {/* Video Existente del Producto */}
          {videoUrl && !selectedVideo ? (
            <View style={styles.existingVideoSection}>
              <Typography variant="body" className="text-gray-700 font-semibold mb-3">
                Video actual del producto
              </Typography>
              <View style={styles.videoContainer}>
                <Video
                  source={{ uri: videoUrl }}
                  style={styles.video}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping
                />
                {/* Botón de eliminar flotante */}
                {!isDeletingVideo ? (
                  <TouchableOpacity
                    style={styles.deleteFloatingButton}
                    onPress={handleDeleteVideo}
                    activeOpacity={0.8}
                  >
                    <Typography variant="body" className="text-white font-bold">
                      ✕
                    </Typography>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.deletingIndicator}>
                    <ActivityIndicator color="#fff" size="small" />
                  </View>
                )}
              </View>
            </View>
          ) : selectedVideo ? (
            <View style={styles.videoPreviewSection}>
              <Typography variant="body" className="text-gray-700 font-semibold mb-3">
                Vista previa
              </Typography>
              <View style={styles.videoContainer}>
                <Video
                  source={{ uri: selectedVideo.uri }}
                  style={styles.video}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping
                />
              </View>
              <View style={styles.videoInfo}>
                <Typography variant="caption" className="text-gray-600">
                  ✓ Video seleccionado - Duración: {selectedVideo.duration ? `${Math.round(selectedVideo.duration / 1000)}s` : 'N/A'}
                </Typography>
              </View>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Typography variant="h2" className="text-gray-400 text-center mb-2">
                🎬
              </Typography>
              <Typography variant="body" className="text-gray-500 text-center mb-2">
                No has seleccionado un video
              </Typography>
              <Typography variant="caption" className="text-gray-400 text-center">
                Usa el botón de arriba para agregar un video de tu producto
              </Typography>
            </View>
          )}

          {/* Upload Button - aparecerá cuando haya video seleccionado */}
          {selectedVideo && (
            <View style={styles.uploadSection}>
              <Button
                variant="primary"
                onPress={handleUploadVideo}
                style={styles.uploadButton}
                disabled={uploadingVideo}
              >
                {uploadingVideo ? (
                  <View style={styles.uploadingContainer}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Typography variant="body" className="font-semibold text-white ml-2">
                      Subiendo video...
                    </Typography>
                  </View>
                ) : (
                  <Typography variant="body" className="font-semibold text-white">
                    ☁️ Subir video
                  </Typography>
                )}
              </Button>
            </View>
          )}
        </ScrollView>

        {/* Modal de Confirmación de Eliminación */}
        <Modal
          visible={showDeleteConfirm}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDeleteConfirm(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.confirmModal}>
              <View style={styles.confirmIconContainer}>
                <Typography variant="h1" className="text-center">
                  ⚠️
                </Typography>
              </View>
              <Typography variant="h3" className="text-gray-800 text-center mb-2">
                ¿Eliminar video?
              </Typography>
              <Typography variant="body" className="text-gray-600 text-center mb-6">
                Esta acción no se puede deshacer. El video se eliminará permanentemente de tu publicación.
              </Typography>
              <View style={styles.confirmActions}>
                <TouchableOpacity
                  style={[styles.confirmButton, styles.cancelButton]}
                  onPress={() => setShowDeleteConfirm(false)}
                >
                  <Typography variant="body" className="text-gray-700 font-semibold">
                    Cancelar
                  </Typography>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmButton, styles.deleteButton]}
                  onPress={confirmDeleteVideo}
                  disabled={isDeletingVideo}
                >
                  {isDeletingVideo ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Typography variant="body" className="text-white font-semibold">
                      Eliminar
                    </Typography>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  premiumBadge: {
    backgroundColor: '#fff7ed',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  actionsContainer: {
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  actionButton: {
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
    backgroundColor: '#f97316',
  },
  actionIconContainer: {
    marginRight: spacing.md,
  },
  actionTextContainer: {
    flex: 1,
  },
  infoBox: {
    backgroundColor: '#f3f4f6',
    padding: spacing.md,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  uploadSection: {
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: spacing.lg,
  },
  uploadButton: {
    minHeight: 50,
  },
  videoPreviewSection: {
    marginBottom: spacing.xl,
  },
  videoContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoInfo: {
    backgroundColor: '#f3f4f6',
    padding: spacing.sm,
    borderRadius: 6,
    marginBottom: spacing.md,
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  existingVideoSection: {
    marginBottom: spacing.xl,
  },
  deleteFloatingButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  deletingIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  confirmModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  confirmIconContainer: {
    marginBottom: spacing.lg,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
});


export default SelectVideo;