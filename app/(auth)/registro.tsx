import { useState } from 'react';
import { View, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button, Container, H1, GoogleIcon } from '@/components/ui';
import { registerUser } from '@/store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { Typography } from '@/components/ui/Typography';

export default function RegisterScreen() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.user);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      // Usar el thunk de Redux solo con email y password
      const result = await dispatch(registerUser({ 
        email: formData.email, 
        password: formData.password 
      }));
      
      // Verificar si el registro fue exitoso
      if (registerUser.fulfilled.match(result)) {
        Alert.alert(
          'Éxito', 
          'Cuenta creada exitosamente',
          [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
        );
      } else if (registerUser.rejected.match(result)) {
        Alert.alert('Error', result.payload as string || 'Error al crear cuenta');
      }
    } catch {
      Alert.alert('Error', 'Ocurrió un error inesperado');
    }
  };

  const handleGoogleLogin = async () => {
    // TODO: Implementar lógica de autenticación con Google
    Alert.alert('Google Login', 'Funcionalidad pendiente de implementar');
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
    >
      <Container type="page" className="justify-center bg-primary">
        <H1 className="text-center mb-8 text-white">Crear Cuenta</H1>
        
        <TextInput
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          autoCapitalize="none"
          keyboardType="email-address"
          className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
        />
        
        <TextInput
          placeholder="Contraseña"
          value={formData.password}
          onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
          secureTextEntry
          className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
        />
        
        <TextInput
          placeholder="Confirmar contraseña"
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
          secureTextEntry
          className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-6 font-mont-regular text-gray-900"
        />
        
        <Button 
          variant="primary" 
          onPress={handleRegister}
          loading={loading}
          className="mb-4 bg-secondary"
        >
          Crear Cuenta
        </Button>

        {/* Mostrar error de Redux si existe */}
        {error && (
          <View className="mb-4 p-3 bg-red-100 rounded-md">
            <Typography variant="body" className="text-red-700">
              {error}
            </Typography>
          </View>
        )}

        {/* Separador */}
        <View className="flex-row items-center mb-4">
          <View className="flex-1 h-px bg-gray-300" />
          <Typography variant="body" className="mx-4 text-gray-300">
            O
          </Typography>
          <View className="flex-1 h-px bg-gray-300" />
        </View>
              
        {/* Botón de Google */}
        <TouchableOpacity 
          onPress={handleGoogleLogin}
          className="mb-4 flex-row items-center justify-center border border-gray-200 bg-white rounded-lg px-4 py-3 active:bg-gray-50 shadow-sm"
          style={{ justifyContent: 'center', position: 'relative' }}
        >
          <View className="mr-3" style={{ position: 'absolute', left: 16 }}>
            <GoogleIcon size={20} />
          </View>
          <Typography variant="button" className="text-gray-700 font-mont-medium">
            Continuar con Google
          </Typography>
        </TouchableOpacity>
        
        <Button 
          variant="ghost" 
          onPress={() => router.back()}
          className="text-white"
        >
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </Container>
    </ScrollView>
  );
}