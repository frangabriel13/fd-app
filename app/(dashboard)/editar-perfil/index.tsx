import { View, ScrollView, TextInput, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks/redux';
import { Typography, Button } from '@/components/ui';
import { spacing, borderRadius } from '@/constants/Styles';
import { useRouter } from 'expo-router';

const EditProfileScreen = () => {
  const router = useRouter();
  const { user } = useAppSelector(state => state.user);
  
  // Estado para wholesaler
  const [wholesalerData, setWholesalerData] = useState({
    name: '',
    phone: '',
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
        phone: '', // Agregar phone cuando esté disponible en el modelo
      });
    } else if (user?.role === 'manufacturer' && user?.manufacturer) {
      setManufacturerData({
        name: user.manufacturer.name || '',
        owner: '', // Agregar owner cuando esté disponible
        phone: '', // Agregar phone cuando esté disponible
        pointOfSale: false, // Agregar pointOfSale cuando esté disponible
        street: '', // Agregar street cuando esté disponible
        minPurchase: '', // Agregar minPurchase cuando esté disponible
        tiktokUrl: '', // Agregar tiktokUrl cuando esté disponible
        instagramNick: '', // Agregar instagramNick cuando esté disponible
        description: '', // Agregar description cuando esté disponible
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

  const handleSave = () => {
    if (!isFormValid()) {
      Alert.alert('Formulario incompleto', 'Por favor completa todos los campos requeridos');
      return;
    }

    // TODO: Implementar guardado con el slice
    Alert.alert('Éxito', 'Los cambios se guardarán próximamente', [
      {
        text: 'OK',
        onPress: () => router.back()
      }
    ]);
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
          disabled={!isFormValid()}
          style={[
            styles.saveButton,
            !isFormValid() && styles.disabledButton
          ]}
          className="bg-primary"
        >
          Guardar cambios
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
