import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Platform, ActivityIndicator, Switch } from 'react-native';
import { spacing, borderRadius, fontSize } from '../../constants/Styles';
import { Colors } from '../../constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
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

  // Actualizar estado local cuando cambian las props
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

      if (!result.canceled && result.assets[0]) {
        await uploadLogo(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting from gallery:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleTakePhoto = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    try {
      if (Platform.OS === 'android') {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadLogo(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
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
      
      const logo = {
        uri,
        type: `image/${fileType}`,
        name: fileName,
      };

      const result = await dispatch(updateManufacturerLogo({
        id: parseInt(user.manufacturer.id),
        logo
      })).unwrap();

      setLocalImage(result.image);
      Alert.alert('Éxito', 'Logo actualizado correctamente');
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      Alert.alert('Error', error || 'No se pudo actualizar el logo');
    }
  };

  const handleImagePress = () => {
    Alert.alert(
      'Actualizar Logo',
      'Elige una opción',
      [
        {
          text: 'Tomar foto',
          onPress: handleTakePhoto,
        },
        {
          text: 'Seleccionar de galería',
          onPress: handleSelectFromGallery,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
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
      
      Alert.alert(
        'Estado actualizado',
        result.live 
          ? '¡Tu tienda ahora está LIVE! Los clientes pueden verte.' 
          : 'Tu tienda ya no está en vivo.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Error toggling live status:', error);
      Alert.alert('Error', error || 'No se pudo cambiar el estado');
    } finally {
      setIsTogglingLive(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo - Clickeable para cambiar imagen */}
      <TouchableOpacity 
        onPress={handleImagePress}
        activeOpacity={0.8}
        disabled={loading}
        style={styles.imageContainer}
      >
        {localImage || image ? (
          <View>
            <Image 
              source={{ uri: localImage || image }} 
              style={styles.image}
              resizeMode="cover"
            />
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={Colors.light.tint} />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={Colors.light.tint} />
            ) : (
              <>
                <AntDesign name="upload" size={32} color={Colors.light.icon} />
                <Text style={styles.uploadText}>Toca para agregar logo</Text>
              </>
            )}
          </View>
        )}
      </TouchableOpacity>

      {/* Control de estado LIVE - Separado y claro */}
      <View style={styles.liveControlContainer}>
        <View style={styles.liveTextContainer}>
          <Text style={styles.liveLabel}>¿Estás en vivo?</Text>
          <Text style={styles.liveSubtext}>
            {localLive ? 'Los clientes pueden verte' : 'Tu tienda no está en vivo'}
          </Text>
        </View>
        
        {isTogglingLive ? (
          <ActivityIndicator size="small" color={Colors.light.tint} />
        ) : (
          <Switch
            value={localLive}
            onValueChange={handleToggleLive}
            trackColor={{ false: '#d1d5db', true: Colors.light.tint }}
            thumbColor={localLive ? '#ffffff' : '#f3f4f6'}
            ios_backgroundColor="#d1d5db"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.light.tint,
  },
  placeholderContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.light.tint,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  uploadText: {
    fontSize: fontSize.xs,
    color: Colors.light.icon,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 70,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  liveTextContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  liveLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  liveSubtext: {
    fontSize: fontSize.sm,
    color: '#6b7280',
  },
});

export default LiveAccount;