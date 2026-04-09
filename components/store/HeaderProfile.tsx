import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Share,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { followManufacturer, unfollowManufacturer } from '@/store/slices/userSlice';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const HeaderProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedManufacturer } = useSelector((state: RootState) => state.manufacturer);
  const { followed, loading: followLoading } = useSelector((state: RootState) => state.user);

  const isFollowed = selectedManufacturer
    ? followed.some((f: any) => f.id === selectedManufacturer.id) || !!selectedManufacturer.isFollowed
    : false;

  const followersCount = selectedManufacturer?.followersCount ?? 0;

  if (!selectedManufacturer) {
    return null;
  }

  const handleFollow = async () => {
    if (isFollowed) {
      await dispatch(unfollowManufacturer(selectedManufacturer.id.toString()));
    } else {
      await dispatch(followManufacturer({
        manufacturerId: selectedManufacturer.id.toString(),
        manufacturer: {
          id: selectedManufacturer.id,
          name: selectedManufacturer.name,
          image: selectedManufacturer.image ?? null,
          userId: selectedManufacturer.userId,
        },
      }));
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Conocé la tienda de ${selectedManufacturer.name} en Fabricante Directo`,
      });
    } catch (_) {
      // silencioso
    }
  };

  const handleInstagram = () => {
    if (selectedManufacturer.instagramNick) {
      const url = `https://instagram.com/${selectedManufacturer.instagramNick}`;
      Linking.openURL(url);
    }
  };

  const handleTikTok = () => {
    if (selectedManufacturer.tiktokUrl) {
      const url = selectedManufacturer.tiktokUrl.replace(/\/live$/, '');
      Linking.openURL(url);
    }
  };

  const handleWhatsApp = () => {
    if (selectedManufacturer.phone) {
      let phoneNumber = selectedManufacturer.phone.replace(/\D/g, '');
      if (!phoneNumber.startsWith('54')) {
        phoneNumber = `54${phoneNumber}`;
      }
      const wspUrl = `https://wa.me/${phoneNumber}`;
      Linking.openURL(wspUrl);
    }
  };

  const renderStars = (rating: number | null) => {
    const stars = [];
    const ratingValue = rating || 0;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= ratingValue ? 'star' : 'star-outline'}
          size={16}
          color={i <= ratingValue ? Colors.orange.dark : '#d1d5db'}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      {/* Header con imagen y datos básicos */}
      <View style={styles.headerSection}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity
            onPress={selectedManufacturer.live && selectedManufacturer.tiktokUrl ? handleTikTok : undefined}
            disabled={!(selectedManufacturer.live && selectedManufacturer.tiktokUrl)}
          >
            <View style={[styles.imageRing, selectedManufacturer.live && styles.imageRingLive]}>
              <Image
                source={selectedManufacturer.image ? { uri: selectedManufacturer.image } : require('@/assets/images/react-logo.png')}
                style={styles.profileImage}
                contentFit="cover"
                transition={200}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{selectedManufacturer.name}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{followersCount}</Text>
              <Text style={styles.statLabel}>seguidores</Text>
            </View>

            {/* Botones de acción al lado de estadísticas */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.followButton, isFollowed && styles.followingButton]}
                onPress={handleFollow}
                disabled={followLoading}
              >
                {followLoading ? (
                  <ActivityIndicator size="small" color={isFollowed ? Colors.blue.dark : '#fff'} />
                ) : (
                  <Text style={[styles.actionButtonText, isFollowed && styles.followingText]}>
                    {isFollowed ? 'Siguiendo' : 'Seguir'}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionButton, styles.shareButton]} onPress={handleShare}>
                <Ionicons name="share-social-outline" size={14} color={Colors.gray.semiDark} />
                <Text style={styles.shareButtonText}>Compartir</Text>
              </TouchableOpacity>
            </View>
          </View>

          { /* Social Media */ }
          <View style={styles.socialNetworksContainer}>
            {selectedManufacturer.instagramNick && (
              <TouchableOpacity
                style={[styles.socialIcon, styles.instagramIcon]}
                onPress={handleInstagram}
              >
                <Ionicons name="logo-instagram" size={22} color="white" />
              </TouchableOpacity>
            )}
            {selectedManufacturer.tiktokUrl && (
              <TouchableOpacity
                style={[styles.socialIcon, styles.tiktokIcon]}
                onPress={handleTikTok}
              >
                <View style={styles.tiktokContainer}>
                  <Ionicons name="logo-tiktok" size={22} color="white" />
                  {selectedManufacturer.live && (
                    <View style={styles.liveIndicator}>
                      <Text style={styles.liveText}>LIVE</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}
            {selectedManufacturer.phone && (
              <TouchableOpacity
                style={[styles.socialIcon, styles.whatsappIcon]}
                onPress={handleWhatsApp}
              >
                <Ionicons name="logo-whatsapp" size={22} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Descripción y calificación */}
      <View style={styles.divDescription}>
        {selectedManufacturer.description && (
          <Text style={styles.description}>{selectedManufacturer.description}</Text>
        )}
        <View style={styles.divRating}>
          <Text style={styles.pRating}>Calificación:</Text>
          <View style={styles.divRatingStars}>
            <View style={styles.divStars}>
              {renderStars(selectedManufacturer.averageRating)}
            </View>
            <Text style={styles.averageRating}>
              {selectedManufacturer.averageRating !== null && selectedManufacturer.averageRating !== undefined
                ? selectedManufacturer.averageRating.toFixed(1)
                : 'Sin calificar'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  profileImageContainer: {},
  imageRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    padding: 2,
    backgroundColor: '#fff',
  },
  imageRingLive: {
    borderColor: '#ef4444',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    backgroundColor: '#f3f4f6',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 6,
    gap: 8,
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 18,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.gray.default,
    lineHeight: 13,
    letterSpacing: 0.3,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  followButton: {
    backgroundColor: Colors.blue.dark,
    borderColor: Colors.blue.dark,
  },
  followingButton: {
    backgroundColor: '#fff',
    borderColor: '#d1d5db',
  },
  shareButton: {
    backgroundColor: '#fff',
    borderColor: '#d1d5db',
    flexDirection: 'row',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  followingText: {
    color: '#111827',
  },
  shareButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray.semiDark,
  },
  socialNetworksContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  socialIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instagramIcon: {
    backgroundColor: '#E4405F',
  },
  tiktokIcon: {
    backgroundColor: '#000000',
    position: 'relative',
  },
  tiktokContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  liveIndicator: {
    position: 'absolute',
    top: 18,
    backgroundColor: '#ff3040',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  liveText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  whatsappIcon: {
    backgroundColor: '#25D366',
  },
  divDescription: {
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginTop: 4,
    gap: 4,
  },
  description: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  divRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pRating: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray.semiDark,
  },
  divRatingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  divStars: {
    flexDirection: 'row',
    gap: 2,
  },
  averageRating: {
    fontSize: 13,
    color: Colors.gray.semiDark,
    fontWeight: '600',
  },
});

export default HeaderProfile;
