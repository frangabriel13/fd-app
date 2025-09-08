import { useState } from 'react';
import { View, Text, StyleSheet, Alert, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Button, Container, H2, BodyText, Input, PhoneInput } from '@/components/ui';
import { useAppDispatch } from '@/hooks/redux';


const DataWholesalerScreen = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    // userId
  });

  const handleSubmit = () => {
    console.log('Form Data:', formData);
  };

  return (
    <Container  type="page" style={styles.container}>
      <View style={styles.content}>
        <H2>Ingresar datos</H2>

        <View style={styles.inputsContainer}>
          <Input
            label="Nombre y Apellido"
            // placeholder="Nombre del negocio"
            // value={formData.name}
            // onChangeText={setValue}
            // error={error}
          />
          <PhoneInput
            label="Teléfono"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <Button
        variant="primary"
        onPress={handleSubmit}
        // disabled={!selectedRole}
        className="bg-primary"
      >
        Continuar
      </Button>
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