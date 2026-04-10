import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { deleteReview, updateReview, createReview } from '@/store/slices/reviewSlice';
import { getManufacturerById } from '@/store/slices/manufacturerSlice';
import ReviewsModal from '@/components/modals/ReviewsModal';
import EditReviewModal from '@/components/modals/EditReviewModal';
import CreateReviewModal from '@/components/modals/CreateReviewModal';
import { Colors } from '@/constants/Colors';

/* ─── TODO: eliminar antes de producción ─── */
const MOCK_REVIEWS = [
  { id: 9001, rating: 5, comment: 'Excelente calidad en los productos, llegaron bien embalados y antes de lo esperado. Muy recomendable para mayoristas.', createdAt: '2026-03-20T10:00:00Z', user: { id: 9001, wholesaler: { name: 'Distribuidora Sur' } } },
  { id: 9002, rating: 4, comment: 'Muy buena atención. Tuvimos una demora en un pedido pero lo resolvieron rápido. Los productos son de primera.', createdAt: '2026-03-15T14:30:00Z', user: { id: 9002, wholesaler: { name: 'Textil Norte' } } },
  { id: 9003, rating: 5, comment: 'Trabajamos hace 2 años con este fabricante y siempre cumple. Calidad constante y buenos precios para volumen.', createdAt: '2026-03-10T09:15:00Z', user: { id: 9003, wholesaler: { name: 'Modas Centro' } } },
  { id: 9004, rating: 3, comment: 'El producto está bien pero la comunicación podría mejorar. A veces tardan en responder los mensajes.', createdAt: '2026-02-28T16:00:00Z', user: { id: 9004, wholesaler: { name: 'Ropa Express' } } },
  { id: 9005, rating: 5, comment: 'Los mejores fabricantes con los que trabajé. Siempre entregan en fecha y la calidad es impecable. Muy profesionales.', createdAt: '2026-02-20T11:00:00Z', user: { id: 9005, wholesaler: { name: 'Mayorista del Litoral' } } },
  { id: 9006, rating: 4, comment: 'Buena relación precio-calidad. Los talles son exactos y la tela muy buena. Seguimos comprando cada temporada.', createdAt: '2026-02-14T08:45:00Z', user: { id: 9006, wholesaler: { name: 'Casa Fernández' } } },
  { id: 9007, rating: 2, comment: 'El último pedido vino con algunas fallas en el terminado. Nos lo cambiaron pero fue un trámite largo.', createdAt: '2026-02-05T13:20:00Z', user: { id: 9007, wholesaler: { name: 'Stock Cuyo' } } },
  { id: 9008, rating: 5, comment: 'Increíble la variedad de modelos. Siempre tienen novedades y los precios son muy competitivos para el volumen que manejamos.', createdAt: '2026-01-30T15:10:00Z', user: { id: 9008, wholesaler: { name: 'Distribuidora Pampa' } } },
  { id: 9009, rating: 4, comment: 'El packaging es excelente, llega todo perfecto. El único punto a mejorar es que el mínimo de compra es bastante alto.', createdAt: '2026-01-22T10:30:00Z', user: { id: 9009, wholesaler: { name: 'Tienda Belgrano' } } },
  { id: 9010, rating: 5, comment: 'Superaron mis expectativas. Hicimos un pedido personalizado y lo cumplieron al detalle. 100% recomendados.', createdAt: '2026-01-15T09:00:00Z', user: { id: 9010, wholesaler: { name: 'Moda Patagonia' } } },
  { id: 9011, rating: 5, comment: 'Llevan años en el rubro y se nota. La confección es de altísima calidad y el servicio de post-venta es muy bueno.', createdAt: '2026-01-08T14:00:00Z', user: { id: 9011, wholesaler: { name: 'Import Rosario' } } },
  { id: 9012, rating: 3, comment: 'Los productos son buenos pero los tiempos de entrega son un poco largos. Habría que mejorar la logística.', createdAt: '2025-12-20T11:30:00Z', user: { id: 9012, wholesaler: { name: 'Boutique Córdoba' } } },
  { id: 9013, rating: 4, comment: 'Muy confiables. Llevamos tres temporadas trabajando juntos y nunca tuvimos problemas graves. Siempre resuelven.', createdAt: '2025-12-10T16:45:00Z', user: { id: 9013, wholesaler: { name: 'Al Por Mayor BA' } } },
  { id: 9014, rating: 5, comment: 'El mejor fabricante que encontré en la plataforma. Precios justos, calidad premium y comunicación fluida. No cambio.', createdAt: '2025-12-01T10:00:00Z', user: { id: 9014, wholesaler: { name: 'Galería Palermo' } } },
  { id: 9015, rating: 4, comment: 'Buen nivel general. Los modelos de temporada estaban muy bien logrados. Pedimos 200 unidades y todo llegó perfecto.', createdAt: '2025-11-25T09:30:00Z', user: { id: 9015, wholesaler: { name: 'Moda Tucumán' } } },
  { id: 9016, rating: 5, comment: 'Trabajo con muchos fabricantes y este es el más prolijo de todos. Cada pedido viene con remito, etiquetas y todo en orden.', createdAt: '2025-11-15T13:00:00Z', user: { id: 9016, wholesaler: { name: 'Central de Ropa Mendoza' } } },
  { id: 9017, rating: 1, comment: 'Tuve una mala experiencia con el último pedido. La tela no era la prometida y tardaron en responderme dos semanas.', createdAt: '2025-11-05T08:00:00Z', user: { id: 9017, wholesaler: { name: 'Proveedor del Norte' } } },
  { id: 9018, rating: 5, comment: 'Nos sorprendieron gratamente. Primeros en responder, primeros en entregar. La calidad habla por sí sola. Volvemos siempre.', createdAt: '2025-10-28T15:30:00Z', user: { id: 9018, wholesaler: { name: 'Textiles San Juan' } } },
  { id: 9019, rating: 4, comment: 'Muy buena onda en el trato. Los precios son accesibles y la calidad está muy por encima de lo que esperábamos.', createdAt: '2025-10-20T11:00:00Z', user: { id: 9019, wholesaler: { name: 'La Comercial Salta' } } },
  { id: 9020, rating: 5, comment: 'Llevamos más de un año trabajando con ellos. Cada temporada mejoran. Muy profesionales y comprometidos con la calidad.', createdAt: '2025-10-10T10:00:00Z', user: { id: 9020, wholesaler: { name: 'Distribuidora El Eje' } } },
];

/* ─── Helpers (fuera del componente para estabilidad de referencias) ─── */

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

/* ─── Sub-componentes ─── */

const RatingStars = ({ rating, size = 13 }: { rating: number; size?: number }) => (
  <View style={styles.starsRow}>
    {[1, 2, 3, 4, 5].map(i => (
      <Ionicons
        key={i}
        name={i <= rating ? 'star' : 'star-outline'}
        size={size}
        color={i <= rating ? Colors.orange.dark : '#d1d5db'}
      />
    ))}
  </View>
);

const StarBarRow = ({ star, count, total }: { star: number; count: number; total: number }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <View style={styles.barRow}>
      <Text style={styles.barStar}>{star}</Text>
      <Ionicons name="star" size={10} color={Colors.orange.dark} />
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%` as any }]} />
      </View>
      <Text style={styles.barCount}>{count}</Text>
    </View>
  );
};

/* ─── Componente principal ─── */

const Reviews = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedManufacturer } = useSelector((state: RootState) => state.manufacturer);
  const { user } = useSelector((state: RootState) => state.user);

  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<{ id: number; rating: number; comment: string } | null>(null);

  if (!selectedManufacturer) return null;

  // TODO: eliminar MOCK_REVIEWS antes de producción
  const reviews = [...(selectedManufacturer.reviews || []), ...MOCK_REVIEWS];
  const currentUserId = user?.id;
  const totalReviews = reviews.length;
  const averageRating = selectedManufacturer.averageRating ?? 0;
  const userHasReview = currentUserId && reviews.some((r: any) => r.user?.id === Number(currentUserId));

  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter((r: any) => r.rating === star).length,
  }));

  const previewReviews = reviews.slice(0, 2);

  const handleEditReview = (review: { id: number; rating: number; comment: string }) => {
    setSelectedReview(review);
    setEditModalVisible(true);
    setModalVisible(false);
  };

  const handleSaveEdit = async (reviewId: number, rating: number, comment: string) => {
    try {
      await dispatch(updateReview({ id: reviewId, rating, comment })).unwrap();
      if (selectedManufacturer?.id) dispatch(getManufacturerById(selectedManufacturer.id));
      Alert.alert('Éxito', 'Comentario actualizado correctamente');
    } catch (error: any) {
      Alert.alert('Error', error || 'No se pudo actualizar el comentario');
      throw error;
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
              if (selectedManufacturer?.id) dispatch(getManufacturerById(selectedManufacturer.id));
              Alert.alert('Éxito', 'Comentario eliminado correctamente');
            } catch (error: any) {
              Alert.alert('Error', error || 'No se pudo eliminar el comentario');
            }
          },
        },
      ],
    );
  };

  const handleSaveCreate = async (manufacturerId: number, rating: number, comment: string) => {
    try {
      await dispatch(createReview({ manufacturerId, rating, comment })).unwrap();
      if (selectedManufacturer?.id) dispatch(getManufacturerById(selectedManufacturer.id));
      Alert.alert('Éxito', 'Tu comentario ha sido publicado');
    } catch (error: any) {
      Alert.alert('Error', error || 'No se pudo publicar el comentario');
      throw error;
    }
  };

  return (
    <View style={styles.container}>

      {/* ── Encabezado de sección ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Opiniones</Text>
        {currentUserId && !userHasReview && (
          <Pressable
            onPress={() => setCreateModalVisible(true)}
            style={({ pressed }) => pressed && styles.rateBtnPressed}
          >
            <View style={styles.rateBtn}>
              <Ionicons name="star" size={12} color="#fff" />
              <Text style={styles.rateBtnText}>Calificar</Text>
            </View>
          </Pressable>
        )}
      </View>

      {totalReviews === 0 ? (
        /* ── Estado vacío ── */
        <View style={styles.emptyState}>
          <Ionicons name="chatbubble-ellipses-outline" size={38} color="#d1d5db" />
          <Text style={styles.emptyTitle}>Sin opiniones aún</Text>
          <Text style={styles.emptySubtitle}>Sé el primero en calificar este fabricante</Text>
        </View>
      ) : (
        <>
          {/* ── Bloque resumen: puntuación global + barras ── */}
          <View style={styles.summaryBlock}>
            <View style={styles.scoreBlock}>
              <Text style={styles.scoreNumber}>
                {averageRating > 0 ? averageRating.toFixed(1) : '—'}
              </Text>
              <RatingStars rating={Math.round(averageRating)} size={16} />
              <Text style={styles.scoreTotal}>
                {totalReviews} {totalReviews === 1 ? 'opinión' : 'opiniones'}
              </Text>
            </View>

            <View style={styles.barsBlock}>
              {distribution.map(({ star, count }) => (
                <StarBarRow key={star} star={star} count={count} total={totalReviews} />
              ))}
            </View>
          </View>

          {/* ── Cards de preview ── */}
          <View style={styles.reviewsList}>
            {previewReviews.map((review: any) => {
              const name = review.user?.wholesaler?.name || 'Usuario';
              const isOwn = currentUserId && review.user?.id === Number(currentUserId);

              return (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.cardHeader}>
                    {/* Avatar con iniciales */}
                    <View style={[styles.avatar, { backgroundColor: getAvatarColor(name) }]}>
                      <Text style={styles.avatarText}>{getInitials(name)}</Text>
                    </View>

                    {/* Nombre + estrellas */}
                    <View style={styles.cardMeta}>
                      <View style={styles.metaTopRow}>
                        <Text style={styles.reviewerName} numberOfLines={1}>{name}</Text>
                        <Text style={styles.timeAgo}>{formatTimeAgo(review.createdAt)}</Text>
                      </View>
                      <RatingStars rating={review.rating} />
                    </View>

                    {/* Acciones si es propia */}
                    {isOwn && (
                      <View style={styles.ownActions}>
                        <Pressable
                          onPress={() => handleEditReview(review)}
                          style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.5 }]}
                          hitSlop={6}
                        >
                          <Ionicons name="create-outline" size={17} color={Colors.blue.dark} />
                        </Pressable>
                        <Pressable
                          onPress={() => handleDeleteReview(review.id)}
                          style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.5 }]}
                          hitSlop={6}
                        >
                          <Ionicons name="trash-outline" size={17} color="#dc2626" />
                        </Pressable>
                      </View>
                    )}
                  </View>

                  <Text style={styles.reviewComment} numberOfLines={3} ellipsizeMode="tail">
                    {review.comment}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* ── Ver todos ── */}
          {totalReviews > 2 && (
            <Pressable
              onPress={() => setModalVisible(true)}
              style={({ pressed }) => pressed && styles.seeAllBtnPressed}
            >
              <View style={styles.seeAllBtn}>
                <Text style={styles.seeAllText}>
                  Ver todos los comentarios ({totalReviews})
                </Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.blue.dark} />
              </View>
            </Pressable>
          )}
        </>
      )}

      {/* ── Modales ── */}
      <ReviewsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        reviews={reviews}
        currentUserId={currentUserId ? Number(currentUserId) : undefined}
        onEditReview={handleEditReview}
        onDeleteReview={handleDeleteReview}
      />
      <EditReviewModal
        visible={editModalVisible}
        onClose={() => { setEditModalVisible(false); setSelectedReview(null); }}
        review={selectedReview}
        onSave={handleSaveEdit}
      />
      <CreateReviewModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        manufacturerId={selectedManufacturer.id}
        onSave={handleSaveCreate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingTop: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  /* Encabezado */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 0.1,
  },
  rateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.orange.dark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rateBtnPressed: {
    opacity: 0.8,
  },
  rateBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },

  /* Estado vacío */
  emptyState: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
  },

  /* Bloque resumen */
  summaryBlock: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    paddingBottom: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  scoreBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 72,
  },
  scoreNumber: {
    fontSize: 38,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 42,
  },
  scoreTotal: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 2,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  barsBlock: {
    flex: 1,
    gap: 5,
    justifyContent: 'center',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  barStar: {
    fontSize: 11,
    color: '#6b7280',
    width: 8,
    textAlign: 'right',
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.orange.dark,
    borderRadius: 3,
  },
  barCount: {
    fontSize: 11,
    color: '#9ca3af',
    width: 18,
    textAlign: 'right',
  },

  /* Lista de reviews */
  reviewsList: {
    gap: 6,
  },

  /* Card individual */
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
  reviewComment: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 19,
  },

  /* Acciones del dueño */
  ownActions: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
    flexShrink: 0,
  },
  actionBtn: {
    padding: 4,
  },

  /* Ver todos */
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 6,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  seeAllBtnPressed: {
    backgroundColor: '#f3f4f6',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.blue.dark,
  },
});

export default Reviews;
