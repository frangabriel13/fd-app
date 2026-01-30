import { View, ScrollView, TextInput, StyleSheet, Switch, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { Typography, Button } from '@/components/ui';
import { spacing, borderRadius } from '@/constants/Styles';
import { useRouter } from 'expo-router';
import { updateManufacturer } from '@/store/slices/manufacturerSlice';
import { updateWholesaler } from '@/store/slices/wholesalerSlice';
import { fetchAuthUser } from '@/store/slices/userSlice';
import { formatTikTokUrlForStorage, extractTikTokNick, formatInstagramNickForStorage, normalizeDescription } from '@/utils/formatters';

const EditProfileScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.user);
  const { loading } = useAppSelector(state => state.manufacturer);

  console.log('Usuario actual:', user);
  
  // Estado para wholesaler
  const [wholesalerData, setWholesalerData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    country: '',
  });

  // Estado para manufacturer
  const [manufacturerData, setManufacturerData] = useState({
    name: '',
    owner: '',
    phone: '',
    pointOfSale: false,
    street: '',
    minPurchase: '',
    tiktokUrl: '',
    instagramNick: '',
    description: '',
  });

  // Cargar datos iniciales según el rol
  useEffect(() => {
    if (user?.role === 'wholesaler' && user?.wholesaler) {
      setWholesalerData({
        name: user.wholesaler.name || '',
        phone: user.wholesaler.phone || '',
        street: user.wholesaler.street || '',
        city: user.wholesaler.city || '',
        province: user.wholesaler.province || '',
        postalCode: user.wholesaler.postalCode || '',
        country: user.wholesaler.country || '',
      });
    } else if (user?.role === 'manufacturer' && user?.manufacturer) {
      setManufacturerData({
        name: user.manufacturer.name || '',
        owner: user.manufacturer.owner || '',
        phone: user.manufacturer.phone || '',
        pointOfSale: user.manufacturer.pointOfSale || false,
        street: user.manufacturer.street || '',
        minPurchase: user.manufacturer.minPurchase ? user.manufacturer.minPurchase.toString() : '',
        tiktokUrl: extractTikTokNick(user.manufacturer.tiktokUrl),
        instagramNick: user.manufacturer.instagramNick || '',
        description: user.manufacturer.description || '',
      });
    }
  }, [user]);

  const handleWholesalerChange = (field: string, value: string) => {
    setWholesalerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleManufacturerChange = (field: string, value: string | boolean) => {
    setManufacturerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    if (user?.role === 'wholesaler') {
      return wholesalerData.name.trim() !== '' && wholesalerData.phone.trim() !== '';
    } else if (user?.role === 'manufacturer') {
      const baseValid = manufacturerData.name.trim() !== '' && 
                       manufacturerData.owner.trim() !== '' && 
                       manufacturerData.phone.trim() !== '';
      
      if (manufacturerData.pointOfSale) {
        return baseValid && manufacturerData.street.trim() !== '';
      }
      return baseValid;
    }
    return false;
  };

  const handleSave = async () => {
    if (!isFormValid()) {
      Alert.alert('Formulario incompleto', 'Por favor completa todos los campos requeridos');
      return;
    }

    if (user?.role === 'manufacturer' && user?.manufacturer?.id) {
      try {
        // Preparar datos para enviar
        const updateData: any = {
          name: manufacturerData.name.trim(),
          owner: manufacturerData.owner.trim(),
          phone: manufacturerData.phone.trim(),
          pointOfSale: manufacturerData.pointOfSale,
          street: manufacturerData.pointOfSale ? manufacturerData.street.trim() : null,
        };

        // Agregar campos opcionales solo si tienen valor
        if (manufacturerData.minPurchase.trim() !== '') {
          updateData.minPurchase = parseFloat(manufacturerData.minPurchase);
        }

        if (manufacturerData.tiktokUrl.trim() !== '') {
          updateData.tiktokUrl = formatTikTokUrlForStorage(manufacturerData.tiktokUrl.trim());
        } else {
          updateData.tiktokUrl = null;
        }

        if (manufacturerData.instagramNick.trim() !== '') {
          updateData.instagramNick = formatInstagramNickForStorage(manufacturerData.instagramNick.trim());
        } else {
          updateData.instagramNick = null;
        }

        if (manufacturerData.description.trim() !== '') {
          updateData.description = normalizeDescription(manufacturerData.description);
        } else {
          updateData.description = null;
        }

        // Actualizar manufacturer
        await dispatch(updateManufacturer({
          id: parseInt(user.manufacturer.id),
          data: updateData
        })).unwrap();

        // Refrescar datos del usuario para reflejar los cambios
        await dispatch(fetchAuthUser()).unwrap();

        Alert.alert('¡Éxito!', 'Tus datos se han actualizado correctamente', [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]);
      } catch (error: any) {
        console.error('Error al actualizar perfil:', error);
        Alert.alert('Error', error || 'No se pudo actualizar el perfil. Intenta nuevamente.');
      }
    } else if (user?.role === 'wholesaler' && user?.wholesaler?.id) {
      try {
        // Preparar datos para enviar
        const updateData = {
          id: user.wholesaler.id,
          name: wholesalerData.name.trim(),
          phone: wholesalerData.phone.trim(),
        };

        // Actualizar wholesaler
        await dispatch(updateWholesaler(updateData)).unwrap();

        Alert.alert('Éxito', 'Tus datos han sido actualizados correctamente');
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Hubo un problema al actualizar tus datos');
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Typography variant="h2" className="text-center text-gray-800 mb-2">
          Editar Perfil
        </Typography>
        
        <Typography variant="body2" className="text-center text-gray-600 mb-8">
          Actualiza tu información personal
        </Typography>

        <View style={styles.formContainer}>
          {user?.role === 'wholesaler' && (
            <>
              <View style={styles.inputGroup}>
                <Typography variant="h4" className="text-gray-700 mb-2">
                  Nombre *
                </Typography>
                <TextInput
                  placeholder="Nombre del mayorista"
                  value={wholesalerData.name}
                  onChangeText={(value) => handleWholesalerChange('name', value)}
                  placeholderTextColor="#9CA3AF"
                  className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
                />
              </View>

              <View style={styles.inputGroup}>
                <Typography variant="h4" className="text-gray-700 mb-2">
                  Teléfono *
                </Typography>
                <TextInput
                  placeholder="Ej: +54 9 11 1234-5678"
                  value={wholesalerData.phone}
                  onChangeText={(value) => handleWholesalerChange('phone', value)}
                  keyboardType="phone-pad"
                  placeholderTextColor="#9CA3AF"
                  className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
                />
              </View>

              <View style={styles.inputGroup}>
                <TextInput
                  placeholder="Calle"
                  value={wholesalerData.street}
                  onChangeText={(value) => handleWholesalerChange('street', value)}
                  placeholderTextColor="#9CA3AF"
                  className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
                />
              </View>

              <View style={styles.inputGroup}>
                <TextInput
                  placeholder="Ciudad"
                  value={wholesalerData.city}
                  onChangeText={(value) => handleWholesalerChange('city', value)}
                  placeholderTextColor="#9CA3AF"
                  className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
                />
              </View>

              <View style={styles.inputGroup}>
                <TextInput
                  placeholder="Provincia"
                  value={wholesalerData.province}
                  onChangeText={(value) => handleWholesalerChange('province', value)}
                  placeholderTextColor="#9CA3AF"
                  className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
                />
              </View>

              <View style={styles.inputGroup}>
                <TextInput
                  placeholder="Código Postal"
                  value={wholesalerData.postalCode}
                  onChangeText={(value) => handleWholesalerChange('postalCode', value)}
                  placeholderTextColor="#9CA3AF"
                  className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
                />
              </View>

              <View style={styles.inputGroup}>
                <TextInput
                  placeholder="País"
                  value={wholesalerData.country}
                  onChangeText={(value) => handleWholesalerChange('country', value)}
                  placeholderTextColor="#9CA3AF"
                  className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
                />
              </View>
            </>
          )}

          {user?.role === 'manufacturer' && (
            <>
              <View style={styles.inputGroup}>
                <Typography variant="h4" className="text-gray-700 mb-2">
                  Nombre del negocio *
                </Typography>
                <TextInput
                  placeholder="Nombre de tu marca o negocio"
                  value={manufacturerData.name}
                  onChangeText={(value) => handleManufacturerChange('name', value)}
                  placeholderTextColor="#9CA3AF"
                  className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
                />
              </View>

              <View style={styles.inputGroup}>
                <Typography variant="h4" className="text-gray-700 mb-2">
                  Nombre del dueño *
                </Typography>
                <TextInput
                  placeholder="Tu nombre completo"
                  value={manufacturerData.owner}
                  onChangeText={(value) => handleManufacturerChange('owner', value)}
                  placeholderTextColor="#9CA3AF"
                  className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
                />
              </View>

              <View style={styles.inputGroup}>
                <Typography variant="h4" className="text-gray-700 mb-2">
                  Teléfono *
                </Typography>
                <TextInput
                  placeholder="Ej: +54 9 11 1234-5678"
                  value={manufacturerData.phone}
                  onChangeText={(value) => handleManufacturerChange('phone', value)}
                  keyboardType="phone-pad"
                  placeholderTextColor="#9CA3AF"
                  className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.switchContainer}>
                  <Typography variant="h4" className="text-gray-700 flex-1">
                    ¿Tienes punto de venta físico?
                  </Typography>
                  <Switch
                    value={manufacturerData.pointOfSale}
                    onValueChange={(value) => handleManufacturerChange('pointOfSale', value)}
                    trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                    thumbColor={manufacturerData.pointOfSale ? '#ffffff' : '#f3f4f6'}
                  />
                </View>
              </View>

              {manufacturerData.pointOfSale && (
                <View style={styles.inputGroup}>
                  <Typography variant="h4" className="text-gray-700 mb-2">
                    Dirección del local *
                  </Typography>
                  <TextInput
                    placeholder="Calle y número"
                    value={manufacturerData.street}
                    onChangeText={(value) => handleManufacturerChange('street', value)}
                    placeholderTextColor="#9CA3AF"
                    className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
                  />
                </View>
              )}

              <View style={styles.inputGroup}>
                <Typography variant="h4" className="text-gray-700 mb-2">
                  Compra mínima
                </Typography>
                <TextInput
                  placeholder="Monto mínimo de compra"
                  value={manufacturerData.minPurchase}
                  onChangeText={(value) => handleManufacturerChange('minPurchase', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                  className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
                />
              </View>

              <View style={styles.inputGroup}>
                <Typography variant="h4" className="text-gray-700 mb-2">
                  Usuario de TikTok
                </Typography>
                <TextInput
                  placeholder="@tuusuario"
                  value={manufacturerData.tiktokUrl}
                  onChangeText={(value) => handleManufacturerChange('tiktokUrl', value)}
                  placeholderTextColor="#9CA3AF"
                  className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Typography variant="h4" className="text-gray-700 mb-2">
                  Usuario de Instagram
                </Typography>
                <TextInput
                  placeholder="@tuusuario"
                  value={manufacturerData.instagramNick}
                  onChangeText={(value) => handleManufacturerChange('instagramNick', value)}
                  placeholderTextColor="#9CA3AF"
                  className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Typography variant="h4" className="text-gray-700 mb-2">
                  Descripción del negocio
                </Typography>
                <TextInput
                  placeholder="Cuéntanos sobre tu negocio, productos que ofreces, etc."
                  value={manufacturerData.description}
                  onChangeText={(value) => handleManufacturerChange('description', value)}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#9CA3AF"
                  className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
                  style={{ textAlignVertical: 'top', minHeight: 100 }}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          variant="primary"
          onPress={handleSave}
          disabled={!isFormValid() || loading}
          style={[
            styles.saveButton,
            (!isFormValid() || loading) && styles.disabledButton
          ]}
          className="bg-primary"
        >
          {loading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ActivityIndicator size="small" color="#fff" />
              <Typography variant="body" className="text-white">
                Guardando...
              </Typography>
            </View>
          ) : (
            'Guardar cambios'
          )}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  formContainer: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  saveButton: {
    minHeight: 50,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default EditProfileScreen;
