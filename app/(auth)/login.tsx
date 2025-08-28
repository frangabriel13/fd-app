import { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button, Container, H1, GoogleIcon } from '@/components/ui';
import { useAppDispatch } from '@/hooks/redux';
import { login } from '@/store/slices/authSlice';
import { Typography } from '@/components/ui/Typography';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError(null); // Limpiar el error antes de intentar iniciar sesión
    try {
      await dispatch(login({ email, password })).unwrap();
      router.push('/(tabs)');
    } catch (err: any) {
      const errorMessage = err.message || 'Error al iniciar sesión';
      const errorInfo = err.info?.message;

      // Mostrar el mensaje de error
      // setError(errorInfo ? `${errorMessage}\n${errorInfo}` : errorMessage);
      setError(errorInfo ? `${errorInfo}` : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('Boton presionado');
  }

  return (
    <Container type="page" className="justify-center bg-primary">
      <H1 className="text-center mb-8 text-white">Iniciar Sesión</H1>

      {error && (
        <Typography variant="body" className="text-red-500 mb-4 text-center">
          {error}
        </Typography>
      )}
      
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
        // disabled={!request || loading}
        className="mb-4 flex-row items-center justify-center border border-gray-200 bg-white rounded-lg px-4 py-3 active:bg-gray-50 shadow-sm"
        style={{ 
          justifyContent: 'center', 
          position: 'relative',
          // opacity: (!request || loading) ? 0.5 : 1 
        }}
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