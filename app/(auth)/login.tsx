import { useState } from 'react';
import { View, TextInput, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button, Container, H1 } from '@/components/ui';
import { useAppDispatch } from '@/hooks/redux';
import { loginManufacturer } from '@/store/slices/manufacturerSlice';
import { Typography } from '@/components/ui/Typography';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    if(!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return
    }

    setLoading(true);
    try {
      await dispatch(loginManufacturer({ email, password })).unwrap();
      router.push('/(tabs)');
    } catch(error: any) {
      Alert.alert('error', error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    // TODO: Implementar lógica de autenticación con Google
    Alert.alert('Google Login', 'Funcionalidad pendiente de implementar');
  }

  return (
    <Container type="page" className="justify-center">
      <H1 className="text-center mb-8">Iniciar Sesión</H1>
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 font-mont-regular"
      />
      
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6 font-mont-regular"
      />

      <TouchableOpacity 
        onPress={() => router.push('/(auth)/recuperar-password')}
        className="mb-6 items-center"
      >
        <Typography variant="body" className="text-blue-500">
          ¿Olvidaste tu contraseña?
        </Typography>
      </TouchableOpacity>
      
      <Button 
        variant="primary" 
        onPress={handleLogin}
        loading={loading}
        className="mb-4"
      >
        Iniciar Sesión
      </Button>
      
      {/* Separador */}
      <View className="flex-row items-center mb-4">
        <View className="flex-1 h-px bg-gray-300" />
        <Typography variant="body" className="mx-4 text-gray-500">
          O
        </Typography>
        <View className="flex-1 h-px bg-gray-300" />
      </View>
      
      {/* Botón de Google */}
      <TouchableOpacity 
        onPress={handleGoogleLogin}
        className="mb-4 flex-row items-center justify-center border border-gray-300 bg-white rounded-lg px-4 py-3 active:bg-gray-50"
      >
        <View className="w-5 h-5 mr-3 items-center justify-center bg-white rounded-full">
          <Typography variant="button" className="text-red-500 font-bold text-lg">
            G
          </Typography>
        </View>
        <Typography variant="button" className="text-gray-700 font-mont-medium">
          Continuar con Google
        </Typography>
      </TouchableOpacity>
      
      <Button 
        variant="ghost" 
        onPress={() => router.push('/(auth)/registro')}
      >
        ¿No tienes cuenta? Regístrate
      </Button>
    </Container>
  );
}


export default LoginScreen;