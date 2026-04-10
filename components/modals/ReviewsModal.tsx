import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface Review {
  id: number;
  userId: number;
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

/* ─── Helpers ─── */

const AVATAR_PALETTE = [
  '#021344', '#1e40af', '#7c3aed', '#15803d', '#b45309', '#be185d',
];

const getAvatarColor = (name: string): string =>
  AVATAR_PALETTE[(name?.charCodeAt(0) ?? 0) % AVATAR_PALETTE.length];

const getInitials = (name: string): string =>
  name ? name.trim().slice(0, 2).toUpperCase() : 'U';

const formatTimeAgo = (dateString: string): string => {
  const diffInSeconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  const intervals = [
    { label: 'año', plural: 'años', seconds: 31536000 },
    { label: 'mes', plural: 'meses', seconds: 2592000 },
    { label: 'día', plural: 'días', seconds: 86400 },
    { label: 'hora', plural: 'horas', seconds: 3600 },
    { label: 'minuto', plural: 'minutos', seconds: 60 },
  ];
  for (const { label, plural, seconds } of intervals) {
    const count = Math.floor(diffInSeconds / seconds);
    if (count >= 1) return `hace ${count} ${count > 1 ? plural : label}`;
  }
  return 'hace unos segundos';
};

const RatingStars = ({ rating }: { rating: number }) => (
  <View style={styles.starsRow}>
    {[1, 2, 3, 4, 5].map(i => (
      <Ionicons
        key={i}
        name={i <= rating ? 'star' : 'star-outline'}
        size={13}
        color={i <= rating ? Colors.orange.dark : '#d1d5db'}
      />
    ))}
  </View>
);

/* ─── Componente ─── */

const ReviewsModal = ({
  visible,
  onClose,
  reviews,
  currentUserId,
  onEditReview,
  onDeleteReview,
}: ReviewsModalProps) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent
    onRequestClose={onClose}
  >
    <View style={styles.overlay}>
      <View style={styles.sheet}>

        {/* Drag handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Opiniones{reviews.length > 0 ? ` (${reviews.length})` : ''}
          </Text>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}
            hitSlop={8}
          >
            <Ionicons name="close" size={24} color="#374151" />
          </Pressable>
        </View>

        {/* Lista */}
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {reviews.map(review => {
            const name = review.user?.wholesaler?.name || 'Usuario';
            const isOwn = currentUserId && review.user?.id === Number(currentUserId);

            return (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.cardHeader}>
                  {/* Avatar */}
                  <View style={[styles.avatar, { backgroundColor: getAvatarColor(name) }]}>
                    <Text style={styles.avatarText}>{getInitials(name)}</Text>
                  </View>

                  {/* Meta */}
                  <View style={styles.cardMeta}>
                    <View style={styles.metaTopRow}>
                      <Text style={styles.reviewerName} numberOfLines={1}>{name}</Text>
                      <Text style={styles.timeAgo}>{formatTimeAgo(review.createdAt)}</Text>
                    </View>
                    <RatingStars rating={review.rating} />
                  </View>

                  {/* Acciones propias */}
                  {isOwn && (
                    <View style={styles.ownActions}>
                      <Pressable
                        onPress={() => onEditReview(review)}
                        style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.5 }]}
                        hitSlop={6}
                      >
                        <Ionicons name="create-outline" size={17} color={Colors.blue.dark} />
                      </Pressable>
                      <Pressable
                        onPress={() => onDeleteReview(review.id)}
                        style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.5 }]}
                        hitSlop={6}
                      >
                        <Ionicons name="trash-outline" size={17} color="#dc2626" />
                      </Pressable>
                    </View>
                  )}
                </View>

                <Text style={styles.comment}>{review.comment}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
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

  /* Lista */
  list: {
    paddingHorizontal: 14,
  },
  listContent: {
    paddingTop: 12,
    gap: 10,
    paddingBottom: 4,
  },

  /* Card */
  reviewCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  cardMeta: {
    flex: 1,
    gap: 3,
  },
  metaTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  timeAgo: {
    fontSize: 11,
    color: '#9ca3af',
    marginLeft: 4,
    flexShrink: 0,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  comment: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 19,
  },
  ownActions: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
    flexShrink: 0,
  },
  actionBtn: {
    padding: 4,
  },
});

export default ReviewsModal;
