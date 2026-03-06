import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    id: number;
    wholesaler?: {
      name: string;
    };
  };
}

interface ReviewsModalProps {
  visible: boolean;
  onClose: () => void;
  reviews: Review[];
  currentUserId?: number;
  onEditReview: (review: Review) => void;
  onDeleteReview: (reviewId: number) => void;
}

const ReviewsModal = ({ 
  visible, 
  onClose, 
  reviews, 
  currentUserId,
  onEditReview,
  onDeleteReview 
}: ReviewsModalProps) => {
  
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = [
      { label: 'año', seconds: 31536000 },
      { label: 'mes', seconds: 2592000 },
      { label: 'día', seconds: 86400 },
      { label: 'hora', seconds: 3600 },
      { label: 'minuto', seconds: 60 }
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return `hace ${count} ${interval.label}${count > 1 ? 's' : ''}`;
      }
    }
    return 'hace unos segundos';
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={15}
          color={i <= rating ? "#f86f1a" : "#d1d5db"}
        />
      );
    }
    return stars;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header del modal */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Todos los comentarios</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#262626" />
            </TouchableOpacity>
          </View>

          {/* Lista de reviews */}
          <ScrollView 
            style={styles.reviewsList}
            showsVerticalScrollIndicator={false}
          >
            {reviews.map((review) => {
              const isOwnReview = currentUserId && review.user?.id === Number(currentUserId);
              
              return (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerInfo}>
                      <Text style={styles.reviewerName}>
                        {review.user?.wholesaler?.name || 'Usuario'}
                      </Text>
                      <View style={styles.starsContainer}>
                        {renderStars(review.rating)}
                      </View>
                    </View>
                    {isOwnReview && (
                      <View style={styles.reviewActions}>
                        <TouchableOpacity 
                          style={styles.actionIcon}
                          onPress={() => onEditReview(review)}
                        >
                          <Ionicons name="create-outline" size={18} color="#021344" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.actionIcon}
                          onPress={() => onDeleteReview(review.id)}
                        >
                          <Ionicons name="trash-outline" size={18} color="#dc2626" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <Text style={styles.comment}>{review.comment}</Text>
                  <View style={styles.reviewFooter}>
                    <Text style={styles.timeAgo}>
                      {formatTimeAgo(review.createdAt)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#262626',
  },
  closeButton: {
    padding: 4,
  },
  reviewsList: {
    paddingHorizontal: 16,
  },
  reviewItem: {
    marginVertical: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionIcon: {
    padding: 4,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#262626',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  comment: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 4,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  timeAgo: {
    fontSize: 12,
    color: '#8e8e8e',
  },
});

export default ReviewsModal;