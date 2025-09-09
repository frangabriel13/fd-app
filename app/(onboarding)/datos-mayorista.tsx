import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Container, H2, Input, PhoneInput, Typography} from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { createWholesaler } from '@/store/slices/wholesalerSlice';
import { router } from 'expo-router';
import { createWholesalerValidator } from '@/utils/validators';
import SuccessModal from '@/components/modals/successModal';
import { useModal } from '@/contexts/ModalContext';

const DataWholesalerScreen = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(state => state.auth.user?.id);
  const { loading, error } = useAppSelector(state => state.wholesaler);
  const { setSuccessModalVisible } = useModal();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    userId: userId || 0, // Cambiar a number
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    phone: '',
  });

  // Limpiar el estado del modal cuando el componente se desmonte
  useEffect(() => {
    return () => {
      setSuccessModalVisible(false);
    };
  }, [setSuccessModalVisible]);

  const handleSubmit = async () => {
    console.log('Submitting form data:', formData);
    
    // Validar los datos del formulario usando el validador
    const validationErrors = createWholesalerValidator(
      formData.name, 
      formData.phone, 
      Number(formData.userId)
    );
    
    if (Object.keys(validationErrors).length > 0) {
      console.log('Validation errors:', validationErrors);
      // Mostrar todos los errores de validación
      setFormErrors({
        name: validationErrors.name || '',
        phone: validationErrors.phone || '',
      });

      return;
    }

    try {
      // Despachar la acción createWholesaler
      console.log('Dispatching createWholesaler with:');
      const resultAction = await dispatch(createWholesaler({
        name: formData.name,
        phone: formData.phone,
        userId: Number(formData.userId) // Convertir a number explícitamente
      }));
      console.log('Result action:', resultAction);

      // Verificar si la acción fue exitosa
      if (createWholesaler.fulfilled.match(resultAction)) {
        setShowSuccessModal(true); // Mostrar el modal de éxito
        setSuccessModalVisible(true); // Actualizar el contexto para desactivar el botón back
        
        // Navegar a las tabs después de 3 segundos
        setTimeout(() => {
          setShowSuccessModal(false);
          setSuccessModalVisible(false);
          router.push('/(tabs)');
        }, 3000);
      } else if (createWholesaler.rejected.match(resultAction)) {
        // El error ya se maneja en el estado global
        Alert.alert('Error', (resultAction.payload as string) || 'Error al crear mayorista');
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
            error={formErrors.name}
            value={formData.name}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
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
        </View>
      </View>

      <Button
        variant="primary"
        onPress={handleSubmit}
        loading={loading}
        disabled={!formData.name || !formData.phone || loading}
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


export default DataWholesalerScreen;