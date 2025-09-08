import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Container, H2, Input, PhoneInput, Typography} from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { createWholesaler } from '@/store/slices/wholesalerSlice';

const DataWholesalerScreen = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(state => state.auth.user?.id);
  const { loading, error, success } = useAppSelector(state => state.wholesaler);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    userId: userId || '',
  });

  const handleSubmit = async () => {
    console.log('Submitting form data:', formData);
    if(!formData.name || !formData.phone || !formData.userId) {
      console.log('Form data incomplete:', formData);
      Alert.alert('Error', 'Por favor completa todos los campos');
      console.log('Form data incomplete:', formData);
      return;
    }

    try {
      // Despachar la acción createWholesaler
      console.log('Dispatching createWholesaler with:');
      const resultAction = await dispatch(createWholesaler({
        name: formData.name,
        phone: formData.phone,
        userId: formData.userId
      }));
      console.log('Result action:', resultAction);

      // Verificar si la acción fue exitosa
      if (createWholesaler.fulfilled.match(resultAction)) {
        Alert.alert('Éxito', 'Mayorista creado correctamente', [
          {
            text: 'OK',
            onPress: () => {
              // Redirigir a la siguiente pantalla o cerrar onboarding
              router.push('/(tabs)'); // O la ruta que corresponda
            }
          }
        ]);
      } else if (createWholesaler.rejected.match(resultAction)) {
        // El error ya se maneja en el estado global
        Alert.alert('Error', resultAction.payload || 'Error al crear mayorista');
      }
    } catch (error) {
      console.log('Error inesperado:', error);
      console.error('Error inesperado:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado');
    }
  };

  return (
    <Container  type="page" style={styles.container}>
      <View style={styles.content}>
        <H2>Ingresar datos</H2>

        <View style={styles.inputsContainer}>
          <Input
            label="Nombre y Apellido"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          />
          <PhoneInput
            label="Teléfono"
            defaultCountryCode="AR"
            value={formData.phone}
            onPhoneChange={(fullPhone, countryCode, phone) => {
              setFormData(prev => ({ ...prev, phone: fullPhone }));
            }}
          />
        </View>
      </View>

      <Button
        variant="primary"
        onPress={handleSubmit}
        className="bg-primary"
      >
        {loading ? 'Creando...' : 'Continuar'}
      </Button>

      {error && <Typography variant="error" className="text-center mt-4">{error}</Typography>}
    </Container>
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
  }
});


export default DataWholesalerScreen;