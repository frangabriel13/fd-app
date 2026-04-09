import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { deleteReview, updateReview, createReview } from '@/store/slices/reviewSlice';
import { getManufacturerById } from '@/store/slices/manufacturerSlice';
import ReviewsModal from '@/components/modals/ReviewsModal';
import EditReviewModal from '@/components/modals/EditReviewModal';
import CreateReviewModal from '@/components/modals/CreateReviewModal';

const Reviews = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedManufacturer } = useSelector((state: RootState) => state.manufacturer);
  const { user } = useSelector((state: RootState) => state.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<{ id: number; rating: number; comment: string } | null>(null);
  
  if (!selectedManufacturer) {
    return null;
  }

  const reviews = selectedManufacturer.reviews || [];
  const currentUserId = user?.id;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = [
      { label: 'año', plural: 'años', seconds: 31536000 },
      { label: 'mes', plural: 'meses', seconds: 2592000 },
      { label: 'día', plural: 'días', seconds: 86400 },
      { label: 'hora', plural: 'horas', seconds: 3600 },
      { label: 'minuto', plural: 'minutos', seconds: 60 }
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return `hace ${count} ${count > 1 ? interval.plural : interval.label}`;
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
  const hasReviews = reviews.length > 0;

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleEditReview = (review: { id: number; rating: number; comment: string }) => {
    setSelectedReview(review);
    setEditModalVisible(true);
    setModalVisible(false); // Cerrar el modal de reviews si está abierto
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setSelectedReview(null);
  };

  const handleSaveEdit = async (reviewId: number, rating: number, comment: string) => {
    try {
      await dispatch(updateReview({ id: reviewId, rating, comment })).unwrap();
      // Recargar el fabricante para actualizar las reviews
      if (selectedManufacturer?.id) {
        await dispatch(getManufacturerById(selectedManufacturer.id));
      }
      Alert.alert('Éxito', 'Comentario actualizado correctamente');
    } catch (error: any) {
      Alert.alert('Error', error || 'No se pudo actualizar el comentario');
      throw error; // Re-lanzar para que el modal maneje el estado
    }
  };

  const handleDeleteReview = (reviewId: number) => {
    Alert.alert(
      'Eliminar comentario',
      '¿Estás seguro de que deseas eliminar tu comentario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteReview(reviewId)).unwrap();
              // Recargar el fabricante para actualizar las reviews
              if (selectedManufacturer?.id) {
                dispatch(getManufacturerById(selectedManufacturer.id));
              }
              Alert.alert('Éxito', 'Comentario eliminado correctamente');
            } catch (error: any) {
              Alert.alert('Error', error || 'No se pudo eliminar el comentario');
            }
          }
        }
      ]
    );
  };

  const handleCreateReview = () => {
    setCreateModalVisible(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalVisible(false);
  };

  const handleSaveCreate = async (manufacturerId: number, rating: number, comment: string) => {
    try {
      await dispatch(createReview({ manufacturerId, rating, comment })).unwrap();
      // Recargar el fabricante para actualizar las reviews
      if (selectedManufacturer?.id) {
        await dispatch(getManufacturerById(selectedManufacturer.id));
      }
      Alert.alert('Éxito', 'Tu comentario ha sido publicado');
    } catch (error: any) {
      Alert.alert('Error', error || 'No se pudo publicar el comentario');
      throw error; // Re-lanzar para que el modal maneje el estado
    }
  };

  // Verificar si el usuario actual ya tiene una review
  const userHasReview = currentUserId && reviews.some((review: any) => review.user?.id === Number(currentUserId));

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Comentarios:</Text>
        {currentUserId && !userHasReview && (
          <TouchableOpacity style={styles.addReviewButton} onPress={handleCreateReview}>
            <Ionicons name="star" size={18} color="white" />
            <Text style={styles.addReviewText}>Calificar</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {reviews.length === 0 ? (
        <View style={styles.noReviewsContainer}>
          <Text style={styles.noReviewsText}>Aún no hay comentarios</Text>
        </View>
      ) : (
        <>
          {reviewsToShow.map((review) => {
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
                        onPress={() => handleEditReview(review)}
                      >
                        <Ionicons name="create-outline" size={18} color="#021344" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionIcon}
                        onPress={() => handleDeleteReview(review.id)}
                      >
                        <Ionicons name="trash-outline" size={18} color="#dc2626" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <Text style={styles.comment} numberOfLines={2} ellipsizeMode="tail">
                  {review.comment}
                </Text>
                <View style={styles.reviewFooter}>
                  <Text style={styles.timeAgo}>
                    {formatTimeAgo(review.createdAt)}
                  </Text>
                </View>
              </View>
            );
          })}
          
          {reviews.length > 2 && (
            <TouchableOpacity style={styles.seeMoreButton} onPress={handleOpenModal}>
              <Text style={styles.seeMoreText}>Ver todo</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      
      <ReviewsModal 
        visible={modalVisible}
        onClose={handleCloseModal}
        reviews={reviews}
        currentUserId={currentUserId ? Number(currentUserId) : undefined}
        onEditReview={handleEditReview}
        onDeleteReview={handleDeleteReview}
      />
      
      <EditReviewModal 
        visible={editModalVisible}
        onClose={handleCloseEditModal}
        review={selectedReview}
        onSave={handleSaveEdit}
      />
      
      <CreateReviewModal 
        visible={createModalVisible}
        onClose={handleCloseCreateModal}
        manufacturerId={selectedManufacturer.id}
        onSave={handleSaveCreate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#262626',
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f86f1a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#f86f1a',
    gap: 4,
  },
  addReviewText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
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
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#f3f4f6',
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