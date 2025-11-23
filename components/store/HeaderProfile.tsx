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
          color={i <= ratingValue ? "#FFD700" : "#E0E0E0"}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      {/* Datos principales */}
      <View style={styles.divData}>
        {/* Perfil */}
        <View style={styles.divProfile}>
          <View style={styles.divImage}>
            <TouchableOpacity
              onPress={manufacturer.live && manufacturer.tiktokUrl ? handleTikTok : undefined}
              disabled={!(manufacturer.live && manufacturer.tiktokUrl)}
            >
              <Image 
                source={manufacturer.image ? { uri: manufacturer.image } : require('@/assets/images/react-logo.png')} 
                style={styles.imgLogo}
              />
            </TouchableOpacity>
            {manufacturer.live && (
              <View style={styles.live}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            )}
          </View>
          <Text style={styles.name}>{manufacturer.name}</Text>
        </View>

        {/* Social */}
        <View style={styles.divSocial}>
          {/* Seguimiento */}
          <View style={styles.divFollow}>
            <View style={styles.divFollowers}>
              <Text style={styles.followersCount}>{followersCount}</Text>
              <Text style={styles.followersText}>Seguidores</Text>
            </View>
            <View style={styles.divActions}>
              <TouchableOpacity 
                style={[styles.btnFollow, isFollowed && styles.following]} 
                onPress={handleFollow}
              >
                <Text style={[styles.btnFollowText, isFollowed && styles.followingText]}>
                  {isFollowed ? 'Siguiendo' : 'Seguir'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnShare}>
                <Text style={styles.btnShareText}>Compartir</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Redes sociales */}
          <View style={styles.divNetwork}>
            {manufacturer.instagramNick && (
              <TouchableOpacity 
                style={[styles.iconShare, styles.instagramIcon]} 
                onPress={handleInstagram}
              >
                <Ionicons name="logo-instagram" size={24} color="white" />
              </TouchableOpacity>
            )}
            {manufacturer.tiktokUrl && (
              <TouchableOpacity 
                style={[styles.iconShare, styles.tiktokIcon]} 
                onPress={handleTikTok}
              >
                <Ionicons name="logo-tiktok" size={24} color="white" />
              </TouchableOpacity>
            )}
            {manufacturer.phone && (
              <TouchableOpacity 
                style={[styles.iconShare, styles.whatsappIcon]} 
                onPress={handleWhatsApp}
              >
                <Ionicons name="logo-whatsapp" size={24} color="white" />
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
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    padding: 24,
    paddingTop: 32,
    paddingBottom: 24,
    marginVertical: 8,
  },
  divData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  divProfile: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '30%',
  },
  divImage: {
    position: 'relative',
    width: 96,
    height: 96,
    marginBottom: 8,
  },
  imgLogo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#f2f2f2',
    backgroundColor: '#fafafa',
  },
  live: {
    position: 'absolute',
    bottom: -12,
    left: 24,
    backgroundColor: '#E53935',
    paddingHorizontal: 16,
    paddingVertical: 3,
    borderRadius: 6,
    shadowColor: '#E53935',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  liveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
    textAlign: 'center',
    marginTop: 4,
  },
  divSocial: {
    flexDirection: 'column',
    width: '70%',
    gap: 16,
  },
  divFollow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  divFollowers: {
    alignItems: 'center',
  },
  followersCount: {
    fontSize: 22,
    fontWeight: '600',
    color: 'black',
  },
  followersText: {
    fontSize: 16,
    color: '#666666',
  },
  divActions: {
    flexDirection: 'column',
    gap: 12,
    flex: 1,
    marginLeft: 24,
  },
  divNetwork: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  iconShare: {
    borderRadius: 25,
    padding: 12,
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
  },
  whatsappIcon: {
    backgroundColor: '#25D366',
  },
  btnFollow: {
    backgroundColor: '#FFB347',
    borderRadius: 6,
    paddingVertical: 11,
    paddingHorizontal: 18,
    alignItems: 'center',
    shadowColor: '#FFCC33',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.13,
    shadowRadius: 4,
    elevation: 2,
  },
  following: {
    backgroundColor: '#f5f5f5',
  },
  btnFollowText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18,
  },
  followingText: {
    color: 'black',
  },
  btnShare: {
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    paddingVertical: 11,
    paddingHorizontal: 18,
    alignItems: 'center',
    shadowColor: '#FFCC33',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.13,
    shadowRadius: 4,
    elevation: 2,
  },
  btnShareText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 18,
  },
  divDescription: {
    paddingTop: 8,
  },
  description: {
    fontSize: 22,
    color: 'black',
    lineHeight: 28,
    marginBottom: 18,
  },
  divRating: {
    gap: 12,
  },
  pRating: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666666',
  },
  divRatingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divStars: {
    flexDirection: 'row',
    gap: 3,
  },
  averageRating: {
    fontSize: 20,
    color: '#666666',
    fontWeight: '600',
  },
});

export default HeaderProfile;