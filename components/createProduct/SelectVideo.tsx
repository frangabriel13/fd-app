import { View, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Typography, Button } from '@/components/ui';
import { spacing } from '@/constants/Styles';

interface SelectVideoProps {
  visible: boolean;
  onClose: () => void;
}

const SelectVideo = ({ visible, onClose }: SelectVideoProps) => {
  const handleClose = () => {
    onClose();
  };

  const handleSelectFromGallery = () => {
    // TODO: Implementar selección de video de galería
    console.log('Seleccionar video de galería');
  };

  const handleUploadVideo = () => {
    // TODO: Implementar subida de video
    console.log('Subir video');
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
            style={[styles.saveButton, styles.disabledButton]}
            disabled={true}
          >
            <Typography variant="body" className="text-gray-400">
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
              (video de 30 segundos máximo)
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

          {/* Empty State */}
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

          {/* Upload Button - aparecerá cuando haya video seleccionado */}
          {false && ( // Cambiar a true cuando haya video seleccionado
            <View style={styles.uploadSection}>
              <Button
                variant="primary"
                onPress={handleUploadVideo}
                style={styles.uploadButton}
              >
                <Typography variant="body" className="font-semibold text-white">
                  ☁️ Subir video
                </Typography>
              </Button>
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
});


export default SelectVideo;