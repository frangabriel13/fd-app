import { useState } from 'react';
import { View, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button, Container, H1, GoogleIcon } from '@/components/ui';
import { registerUser } from '@/store/slices/userSlice';
import { googleLogin } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { Typography } from '@/components/ui/Typography';
import { registerUserValidator } from '@/utils/validators';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';

export default function RegisterScreen() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.user);
  const { signIn: googleSignIn, isLoading: googleLoading, error: googleError } = useGoogleSignIn();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = async () => {
    const validationErrors = registerUserValidator(
      formData.email,
      formData.password,
      formData.confirmPassword
    );

    if (Object.keys(validationErrors).length > 0) {
      Alert.alert('Error', Object.values(validationErrors).join('\n'));
      return;
    }

    try {
      const result = await dispatch(registerUser({ 
        email: formData.email, 
        password: formData.password 
      }));
      
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
    try {
      const userInfo = await googleSignIn();
      
      if (userInfo && 'data' in userInfo && userInfo.data) {
        const { idToken, user } = userInfo.data;
        if (!idToken || !user.email || !user.name) {
          Alert.alert('Error', 'Datos incompletos de Google Sign-In');
          return;
        }

        const googleData = {
          idToken,
          email: user.email,
          name: user.name,
          photo: user.photo || '',
        };

        await dispatch(googleLogin(googleData)).unwrap();
        router.replace('/(tabs)');
      } else {
        console.log('Respuesta de Google Sign-In:', userInfo);
        Alert.alert('Error', 'Error en la respuesta de Google Sign-In');
      }
    } catch (error: any) {
      console.error('Error en Google Sign-In:', error);
      Alert.alert('Error', error.message || 'Error al iniciar sesión con Google');
    }
  };

  const isFormValid = formData.email && formData.password && formData.confirmPassword;

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
          disabled={!isFormValid || loading}
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
          disabled={googleLoading}
          className="mb-4 flex-row items-center justify-center border border-gray-200 bg-white rounded-lg px-4 py-3 active:bg-gray-50 shadow-sm"
          style={{ 
            justifyContent: 'center', 
            position: 'relative',
            opacity: googleLoading ? 0.5 : 1 
          }}
        >
          <View className="mr-3" style={{ position: 'absolute', left: 16 }}>
            <GoogleIcon size={20} />
          </View>
          <Typography variant="button" className="text-gray-700 font-mont-medium">
            {googleLoading ? 'Conectando...' : 'Continuar con Google'}
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