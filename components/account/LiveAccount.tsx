import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  Platform,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateManufacturerLogo, activateLiveManufacturer } from '@/store/slices/manufacturerSlice';
import { fetchAuthUser } from '@/store/slices/userSlice';

interface LiveAccountProps {
  image?: string;
  live?: boolean;
}

const LiveAccount = ({ image, live }: LiveAccountProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.user);
  const { loading } = useAppSelector(state => state.manufacturer);
  const [localImage, setLocalImage] = useState<string | undefined>(image);
  const [localLive, setLocalLive] = useState<boolean>(live || false);
  const [isTogglingLive, setIsTogglingLive] = useState(false);

  useEffect(() => {
    setLocalLive(live || false);
  }, [live]);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
        Alert.alert(
          'Permisos necesarios',
          'Necesitamos permisos para acceder a la cámara y galería de fotos.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const handleSelectFromGallery = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) await uploadLogo(result.assets[0].uri);
    } catch {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleTakePhoto = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;
    try {
      if (Platform.OS === 'android') await new Promise(resolve => setTimeout(resolve, 100));
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) await uploadLogo(result.assets[0].uri);
    } catch {
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const uploadLogo = async (uri: string) => {
    if (!user?.manufacturer?.id) {
      Alert.alert('Error', 'No se pudo identificar el fabricante');
      return;
    }
    try {
      const fileName = uri.split('/').pop() || 'logo.jpg';
      const fileType = fileName.split('.').pop();
      const logo = { uri, type: `image/${fileType}`, name: fileName };
      const result = await dispatch(
        updateManufacturerLogo({ id: parseInt(user.manufacturer.id), logo })
      ).unwrap();
      setLocalImage(result.image);
      Alert.alert('Éxito', 'Logo actualizado correctamente');
    } catch (error: any) {
      Alert.alert('Error', error || 'No se pudo actualizar el logo');
    }
  };

  const handleImagePress = () => {
    Alert.alert(
      'Actualizar Logo',
      'Elige una opción',
      [
        { text: 'Tomar foto', onPress: handleTakePhoto },
        { text: 'Seleccionar de galería', onPress: handleSelectFromGallery },
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleToggleLive = async () => {
    if (isTogglingLive) return;
    try {
      setIsTogglingLive(true);
      const result = await dispatch(activateLiveManufacturer()).unwrap();
      setLocalLive(result.live);
      // Refrescar datos del usuario para que se refleje en toda la app
      await dispatch(fetchAuthUser()).unwrap();
    } catch (error: any) {
      Alert.alert('Error', error || 'No se pudo cambiar el estado');
    } finally {
      setIsTogglingLive(false);
    }
  };

  const hasImage = !!(localImage || image);
  const brandName = user?.manufacturer?.name || user?.name || 'Mi Tienda';

  return (
    <>
      <Text style={styles.sectionTitle}>Mi Perfil</Text>
      <View style={styles.card}>
        {/* Fila de perfil — clickeable para cambiar logo */}
        <Pressable
          onPress={handleImagePress}
          disabled={loading}
          android_ripple={{ color: '#f3f4f6' }}
          style={({ pressed }) => [pressed && !loading && styles.pressed]}
        >
          <View style={styles.profileRow}>
            {/* Avatar */}
            <View style={styles.avatarWrapper}>
              {hasImage ? (
                <Image
                  source={{ uri: localImage || image }}
                  style={[
                    styles.avatar,
                    { borderColor: localLive ? '#ef4444' : Colors.blue.dark },
                  ]}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  {loading ? (
                    <ActivityIndicator size="small" color={Colors.blue.dark} />
                  ) : (
                    <Ionicons name="business-outline" size={24} color={Colors.blue.dark} />
                  )}
                </View>
              )}
              {loading && hasImage && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              )}
              <View style={styles.editBadge}>
                <Ionicons name="camera" size={11} color="#fff" />
              </View>
            </View>

            {/* Info de la marca */}
            <View style={styles.brandInfo}>
              <Text style={styles.brandName} numberOfLines={1}>{brandName}</Text>
              <Text style={styles.brandRole}>Fabricante</Text>
              <Text style={styles.editHint}>Toca para cambiar logo</Text>
            </View>

            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </View>
        </Pressable>

        <View style={styles.separator} />

        {/* Control de estado LIVE */}
        <View style={styles.liveRow}>
          <View style={[styles.liveDot, { backgroundColor: localLive ? '#ef4444' : '#d1d5db' }]} />
          <View style={styles.liveTextBlock}>
            <Text style={styles.liveLabel}>¿Estás en vivo?</Text>
            <Text style={styles.liveHint}>
              {localLive ? 'Tus clientes pueden verte' : 'No estás en vivo'}
            </Text>
          </View>
          {isTogglingLive ? (
            <ActivityIndicator size="small" color={Colors.blue.dark} />
          ) : (
            <Switch
              value={localLive}
              onValueChange={handleToggleLive}
              trackColor={{ false: '#d1d5db', true: '#ef4444' }}
              thumbColor="#ffffff"
              ios_backgroundColor="#d1d5db"
            />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  pressed: {
    backgroundColor: '#f9fafb',
  },

  // — Fila de perfil —
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
    width: 52,
    height: 52,
    flexShrink: 0,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: Colors.blue.dark,
  },
  avatarPlaceholder: {
    backgroundColor: '#e8edf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.blue.dark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  brandInfo: {
    flex: 1,
    gap: 2,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  brandRole: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  editHint: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 1,
  },

  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },

  // — Fila LIVE —
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  liveTextBlock: {
    flex: 1,
    gap: 2,
  },
  liveLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  liveHint: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default LiveAccount;
