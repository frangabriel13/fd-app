import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Colors } from '@/constants/Colors';

interface CreateReviewModalProps {
  visible: boolean;
  onClose: () => void;
  manufacturerId: number;
  onSave: (manufacturerId: number, rating: number, comment: string) => Promise<void>;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Muy malo',
  2: 'Malo',
  3: 'Regular',
  4: 'Bueno',
  5: 'Excelente',
};

const CreateReviewModal = ({ visible, onClose, manufacturerId, onSave }: CreateReviewModalProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (comment.trim().length === 0) {
      Alert.alert('Error', 'Por favor escribí un comentario');
      return;
    }
    setLoading(true);
    try {
      await onSave(manufacturerId, rating, comment);
      setRating(5);
      setComment('');
      onClose();
    } catch {
      // El error se maneja en el padre
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(5);
    setComment('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />

        <View style={styles.sheet}>
          {/* Drag handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Calificar fabricante</Text>
            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}
              hitSlop={8}
            >
              <Ionicons name="close" size={24} color="#374151" />
            </Pressable>
          </View>

          {/* Contenido */}
          <View style={styles.content}>

            {/* Estrellas */}
            <View style={styles.ratingSection}>
              <Text style={styles.label}>Tu calificación</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(i => (
                  <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starBtn}>
                    <Ionicons
                      name={i <= rating ? 'star' : 'star-outline'}
                      size={40}
                      color={i <= rating ? Colors.orange.dark : '#d1d5db'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingLabel}>{RATING_LABELS[rating]}</Text>
            </View>

            {/* Comentario */}
            <View style={styles.commentSection}>
              <Text style={styles.label}>Tu comentario</Text>
              <TextInput
                style={styles.textInput}
                value={comment}
                onChangeText={setComment}
                placeholder="Contá tu experiencia con este fabricante..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                maxLength={500}
              />
              <Text style={styles.charCount}>{comment.length}/500</Text>
            </View>

            {/* Acciones */}
            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={styles.submitBtnText}>Publicar</Text>
              }
            </TouchableOpacity>

          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 28,
  },

  /* Handle + header */
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  closeBtn: {
    padding: 4,
  },

  /* Contenido */
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  /* Estrellas */
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  starBtn: {
    padding: 4,
  },
  ratingLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 8,
    fontWeight: '500',
  },

  /* Comentario */
  commentSection: {
    marginBottom: 24,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: '#111827',
    minHeight: 110,
  },
  charCount: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 6,
  },

  /* Acciones */
  submitBtn: {
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: Colors.blue.dark,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});

export default CreateReviewModal;
