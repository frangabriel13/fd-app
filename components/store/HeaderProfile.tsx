import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Linking
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Ionicons } from '@expo/vector-icons';

const HeaderProfile = () => {
  const { selectedManufacturer } = useSelector((state: RootState) => state.manufacturer);
  const [isFollowed, setIsFollowed] = useState(false);
  const [followersCount] = useState(0);
  
  const manufacturer = selectedManufacturer;

  if (!manufacturer) {
    return null;
  }

  const handleFollow = () => {
    setIsFollowed(!isFollowed);
  };

  const handleInstagram = () => {
    if (manufacturer.instagramNick) {
      const url = `https://instagram.com/${manufacturer.instagramNick}`;
      Linking.openURL(url);
    }
  };

  const handleTikTok = () => {
    if (manufacturer.tiktokUrl) {
      const url = manufacturer.tiktokUrl.replace(/\/live$/, '');
      Linking.openURL(url);
    }
  };

  const handleWhatsApp = () => {
    if (manufacturer.phone) {
      let phoneNumber = manufacturer.phone.replace(/\D/g, '');
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
          name={i <= ratingValue ? "star" : "star-outline"}
          size={18}
          color={i <= ratingValue ? "#FFD700" : "#f86f1a"}
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
            onPress={manufacturer.live && manufacturer.tiktokUrl ? handleTikTok : undefined}
            disabled={!(manufacturer.live && manufacturer.tiktokUrl)}
          >
            <Image 
              source={manufacturer.image ? { uri: manufacturer.image } : require('@/assets/images/react-logo.png')} 
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{manufacturer.name}</Text>
          
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
              >
                <Text style={[styles.actionButtonText, isFollowed && styles.followingText]}>
                  {isFollowed ? 'Siguiendo' : 'Seguir'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, styles.shareButton]}>
                <Text style={styles.shareButtonText}>Compartir</Text>
              </TouchableOpacity>
            </View>
          </View>

          { /* Social Media */ }
          <View style={styles.socialNetworksContainer}>
            {manufacturer.instagramNick && (
              <TouchableOpacity 
                style={[styles.socialIcon, styles.instagramIcon]} 
                onPress={handleInstagram}
              >
                <Ionicons name="logo-instagram" size={26} color="white" />
              </TouchableOpacity>
            )}
            {manufacturer.tiktokUrl && (
              <TouchableOpacity 
                style={[styles.socialIcon, styles.tiktokIcon]} 
                onPress={handleTikTok}
              >
                <View style={styles.tiktokContainer}>
                  <Ionicons name="logo-tiktok" size={26} color="white" />
                  {manufacturer.live && (
                    <View style={styles.liveIndicator}>
                      <Text style={styles.liveText}>LIVE</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}
            {manufacturer.phone && (
              <TouchableOpacity 
                style={[styles.socialIcon, styles.whatsappIcon]} 
                onPress={handleWhatsApp}
              >
                <Ionicons name="logo-whatsapp" size={26} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Descripción y calificación */}
      <View style={styles.divDescription}>
        {manufacturer.description && (
          <Text style={styles.description}>{manufacturer.description}</Text>
        )}
        <View style={styles.divRating}>
          <Text style={styles.pRating}>Calificación de los usuarios:</Text>
          <View style={styles.divRatingStars}>
            <View style={styles.divStars}>
              {renderStars(manufacturer.averageRating)}
            </View>
            <Text style={styles.averageRating}>
              {manufacturer.averageRating !== null && manufacturer.averageRating !== undefined
                ? manufacturer.averageRating.toFixed(1)
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
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    paddingVertical: 12,
    paddingHorizontal: 8,
    // marginVertical: 4,
    borderRadius: 0,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    // marginBottom: 4,
  },
  // Nueva estructura tipo Instagram
  profileImageContainer: {
    marginRight: 8,
  },
  profileImage: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e1e1e1',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#262626',
    // marginBottom: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0,
    marginTop: 4,
    marginBottom: 4,
  },
  statItem: {
    alignItems: 'flex-start',
    // marginRight: 24,
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
    lineHeight: 14,
  },
  statLabel: {
    fontSize: 14,
    color: '#8e8e8e',
    lineHeight: 14,
  },
  // Botones de acción estilo Instagram
  actionsContainer: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
    marginLeft: 6,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minWidth: 60,
  },
  followButton: {
    backgroundColor: '#021344',
    borderColor: '#021344',
  },
  followingButton: {
    backgroundColor: 'white',
    borderColor: '#dbdbdb',
  },
  shareButton: {
    backgroundColor: '#e5e7eb',
    borderColor: '#e5e7eb',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  followingText: {
    color: '#262626',
  },
  shareButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#262626',
  },
  // Redes sociales más compactas
  socialNetworksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 6,
  },
  socialIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    top: 26,
    backgroundColor: '#ff3040',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    shadowColor: '#ff3040',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  liveText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  whatsappIcon: {
    backgroundColor: '#25D366',
  },
  // Descripción y rating más limpios
  divDescription: {
    paddingTop: 2,
  },
  description: {
    fontSize: 16,
    color: '#262626',
    lineHeight: 20,
    marginBottom: 8,
  },
  divRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pRating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8e8e8e',
  },
  divRatingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divStars: {
    flexDirection: 'row',
    gap: 2,
  },
  averageRating: {
    fontSize: 14,
    color: '#8e8e8e',
    fontWeight: '600',
  },
});

export default HeaderProfile;