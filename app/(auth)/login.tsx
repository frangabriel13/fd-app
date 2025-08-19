import { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button, Container, H1, Spacer } from '@/components/ui';
import { useAppDispatch } from '@/hooks/redux';
import { loginManufacturer } from '@/store/slices/manufacturerSlice';

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
      
      <Button 
        variant="primary" 
        onPress={handleLogin}
        loading={loading}
        className="mb-4"
      >
        Iniciar Sesión
      </Button>
      
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