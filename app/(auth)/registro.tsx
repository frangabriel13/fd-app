import { useState } from 'react';
import { View, TextInput, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button, Container, H1 } from '@/components/ui';
import { manufacturerInstance } from '@/services';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await manufacturerInstance.post('/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      Alert.alert(
        'Éxito', 
        'Cuenta creada exitosamente',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Container type="page" className="justify-center">
        <H1 className="text-center mb-8">Crear Cuenta</H1>
        
        <TextInput
          placeholder="Nombre completo"
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 font-mont-regular"
        />
        
        <TextInput
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          autoCapitalize="none"
          keyboardType="email-address"
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 font-mont-regular"
        />
        
        <TextInput
          placeholder="Contraseña"
          value={formData.password}
          onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
          secureTextEntry
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 font-mont-regular"
        />
        
        <TextInput
          placeholder="Confirmar contraseña"
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
          secureTextEntry
          className="border border-gray-300 rounded-lg px-4 py-3 mb-6 font-mont-regular"
        />
        
        <Button 
          variant="primary" 
          onPress={handleRegister}
          loading={loading}
          className="mb-4"
        >
          Crear Cuenta
        </Button>
        
        <Button 
          variant="ghost" 
          onPress={() => router.back()}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </Container>
    </ScrollView>
  );
}