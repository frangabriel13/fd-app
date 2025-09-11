import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Container, H2, Input, InputMoney, PhoneInput, InputSelect, Typography} from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { createManufacturer } from '@/store/slices/manufacturerSlice';
import { router } from 'expo-router';
import { createManufacturerValidator } from '@/utils/validators';
import SuccessModal from '@/components/modals/successModal';
import { useModal } from '@/contexts/ModalContext';

const DataManufacturerScreen = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(state => state.auth.user?.id);
  const { loading, error } = useAppSelector(state => state.manufacturer);
  const { setSuccessModalVisible } = useModal();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    pointOfSale: '',
    street: '',
    galleryName: '',
    storeNumber: '',
    owner: '',
    phone: '',
    minPurchase: 0,
    userId: userId || 0,
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    phone: '',
    pointOfSale: '',
    street: '',
    galleryName: '',
    storeNumber: '',
    owner: '',
    minPurchase: '',
  });

  useEffect(() => {
    return () => {
      setSuccessModalVisible(false);
    };
  }, [setSuccessModalVisible]);

  const handleSubmit = async () => {
      console.log('Submitting form data:', formData);
      
      // Validar los datos del formulario usando el validador
      const validationErrors = createManufacturerValidator(
        formData.name, 
        formData.phone, 
        Number(formData.userId)
      );
      
      if (Object.keys(validationErrors).length > 0) {
        // Mostrar todos los errores de validación
        setFormErrors({
          name: validationErrors.name || '',
          phone: validationErrors.phone || '',
          pointOfSale: validationErrors.pointOfSale || '',
          street: validationErrors.street || '',
          owner: validationErrors.owner || '',
          minPurchase: validationErrors.minPurchase || '',
          galleryName: validationErrors.galleryName || '',
          storeNumber: validationErrors.storeNumber || '',
        });
  
        return;
      }
  
      try {
        // Despachar la acción createWholesaler
        console.log('Dispatching createWholesaler with:');
        const resultAction = await dispatch(createManufacturer({
          name: formData.name,
          phone: formData.phone,
          pointOfSale: formData.pointOfSale,
          street: formData.street,
          owner: formData.owner,
          minPurchase: formData.minPurchase,
          userId: Number(formData.userId)
        }));
  
        // Verificar si la acción fue exitosa
        if (createManufacturer.fulfilled.match(resultAction)) {
          setShowSuccessModal(true); // Mostrar el modal de éxito
          setSuccessModalVisible(true); // Actualizar el contexto para desactivar el botón back
          
          // Navegar a las tabs después de 3 segundos
          setTimeout(() => {
            setShowSuccessModal(false);
            setSuccessModalVisible(false);
            router.push('/(tabs)');
          }, 3000);
        } else if (createManufacturer.rejected.match(resultAction)) {
          // El error ya se maneja en el estado global
          Alert.alert('Error', (resultAction.payload as string) || 'Error al crear fabricante');
        }
      } catch (error) {
        console.log('Error inesperado:', error);
        console.error('Error inesperado:', error);
        Alert.alert('Error', 'Ocurrió un error inesperado');
      }
    };

  return (
    showSuccessModal ? (
      <Container type="page" className="justify-center bg-primary">
        <SuccessModal
          title="¡Registrato con éxito!"
          text="Será redireccionado a la página de inicio."
        />
      </Container>
    ) : (
      <Container type="page" style={styles.container}>
        <View style={styles.content}>
          <H2>Ingresar datos</H2>
  
          <View style={styles.inputsContainer}>
            <Input
              label="Nombre y Apellido"
              error={formErrors.owner}
              value={formData.owner}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, owner: text }))}
            />
            <Input
              label="Nombre de tu marca"
              error={formErrors.name}
              value={formData.name}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
            />
            <InputMoney
              label="Compra mínima por mayor"
              error={formErrors.minPurchase}
              value={formData.minPurchase.toString()}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, minPurchase: Number(text) || 0 }))}
            />
            <PhoneInput
              label="Teléfono"
              defaultCountryCode="AR"
              value={formData.phone}
              error={formErrors.phone}
              onPhoneChange={(fullPhone, countryCode, phone) => {
                setFormData((prev) => ({ ...prev, phone: fullPhone }));
              }}
            />
            <InputSelect
              label="¿Cuénta con punto de venta?"
              options={[
                { label: 'Sí', value: 'true' },
                { label: 'No', value: 'false' }
              ]}
              value={formData.pointOfSale}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, pointOfSale: value }))}
            />
          </View>

          {formData.pointOfSale === 'true' && (
            <View style={styles.inputsContainer}>
              <Input
                label="Dirección del local"
                error={formErrors.street}
                value={formData.street}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, street: text }))}
              />
              <Input
                label="Nombre de la galería (opcional)"
                error={formErrors.galleryName}
                value={formData.galleryName}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, galleryName: text }))}
              />
              <Input
                label="Número del local/puesto (opcional)"
                error={formErrors.storeNumber}
                value={formData.storeNumber}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, storeNumber: text }))}
              />
            </View>
          )}
        </View>
  
        <Button
          variant="primary"
          onPress={handleSubmit}
          loading={loading}
          disabled={!formData.name || !formData.phone || !formData.pointOfSale || loading}
          className="bg-primary"
        >
          {loading ? 'Creando...' : 'Continuar'}
        </Button>
  
        {error && <Typography variant="body" style={styles.errorText}>{error}</Typography>}
      </Container>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    gap: 30,
  },
  inputsContainer: {
    gap: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
});


export default DataManufacturerScreen;