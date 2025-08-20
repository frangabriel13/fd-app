import { useState } from 'react';
import { View, TextInput, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button, Container, H1, GoogleIcon } from '@/components/ui';
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
    <Container type="page" className="justify-center bg-primary">
      <H1 className="text-center mb-8 text-white">Iniciar Sesión</H1>
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#9CA3AF"
        className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
      />
      
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#9CA3AF"
        className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-6 font-mont-regular text-gray-900"
      />

      
      <Button 
        variant="primary" 
        onPress={handleLogin}
        loading={loading}
        className="mb-4 rounded-md bg-secondary"
      >
        Iniciar Sesión
      </Button>
      
      <Button 
        variant="ghost"
        // size="zero"
        onPress={() => router.push('/(auth)/recuperar-password')}
        className="mb-6 text-white py-0"
      >
        ¿Olvidaste tu contraseña?
      </Button>

      {/* Separador */}
      <View className="flex-row items-center mb-4">
        <View className="flex-1 h-px bg-gray-400" />
        <Typography variant="body" className="mx-4 text-gray-300">
          O
        </Typography>
        <View className="flex-1 h-px bg-gray-400" />
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
        // size='zero'
        onPress={() => router.push('/(auth)/registro')}
        className="text-white"
      >
        ¿No tienes cuenta? Regístrate
      </Button>
    </Container>
  );
}


export default LoginScreen;