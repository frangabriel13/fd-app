import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Ionicons } from '@expo/vector-icons';

const Reviews = () => {
  const { selectedManufacturer } = useSelector((state: RootState) => state.manufacturer);
  
  if (!selectedManufacturer) {
    return null;
  }

  const reviews = selectedManufacturer.reviews || [];

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

  const getReviewsToShow = () => {
    if (reviews.length === 0) return [];
    if (reviews.length === 1) return reviews;
    return reviews.slice(0, 2);
  };

  const reviewsToShow = getReviewsToShow();
  const hasMoreReviews = reviews.length > 2;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comentarios:</Text>
      
      {reviews.length === 0 ? (
        <View style={styles.noReviewsContainer}>
          <Text style={styles.noReviewsText}>Aún no hay comentarios</Text>
        </View>
      ) : (
        <>
          {reviewsToShow.map((review) => (
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
                <Text style={styles.timeAgo}>
                  {formatTimeAgo(review.createdAt)}
                </Text>
              </View>
              <Text style={styles.comment}>{review.comment}</Text>
            </View>
          ))}
          
          {hasMoreReviews && (
            <TouchableOpacity style={styles.seeMoreButton}>
              <Text style={styles.seeMoreText}>Ver más comentarios</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 0,
    paddingHorizontal: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#262626',
  },
  noReviewsContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  noReviewsText: {
    fontSize: 14,
    color: '#8e8e8e',
    fontStyle: 'italic',
  },
  reviewItem: {
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#f3f4f6',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewerInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    gap: 8,
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
  timeAgo: {
    fontSize: 12,
    color: '#8e8e8e',
    flexShrink: 0,
  },
  comment: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  seeMoreButton: {
    marginTop: 8,
    paddingVertical: 8,
  },
  seeMoreText: {
    fontSize: 14,
    color: '#021344',
    fontWeight: '600',
    textAlign: 'center',
  },
});


export default Reviews;