import { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button, Container, H1, GoogleIcon } from '@/components/ui';
import { registerUser } from '@/store/slices/userSlice';
import { googleLogin, resetAuthState } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { Typography } from '@/components/ui/Typography';
import { registerUserValidator } from '@/utils/validators';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import Feather from '@expo/vector-icons/Feather';

export default function RegisterScreen() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.user);
  const { signIn: googleSignIn, isLoading: googleLoading } = useGoogleSignIn();
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  const handleRegister = async () => {
    setError(null);
    const validationErrors = registerUserValidator(
      formData.email,
      formData.password,
      formData.confirmPassword
    );

    if (Object.keys(validationErrors).length > 0) {
      setError(Object.values(validationErrors)[0]);
      return;
    }

    try {
      const result = await dispatch(registerUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      }));

      if (registerUser.fulfilled.match(result)) {
        router.replace(`/(auth)/verificar-cuenta?email=${encodeURIComponent(formData.email.trim().toLowerCase())}`);
      } else if (registerUser.rejected.match(result)) {
        setError(result.payload as string || 'Error al crear cuenta');
      }
    } catch {
      setError('Ocurrió un error inesperado');
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const userInfo = await googleSignIn();

      if (userInfo && 'data' in userInfo && userInfo.data) {
        const { idToken, user } = userInfo.data;
        if (!idToken || !user.email || !user.name) {
          setError('Datos incompletos de Google Sign-In');
          return;
        }

        const googleData = {
          idToken,
          email: user.email,
          name: user.name,
          photo: user.photo || '',
        };

        const result = await dispatch(googleLogin(googleData)).unwrap();
        if (result.user?.role) {
          router.replace('/(tabs)');
        }
      } else {
        setError('Error en la respuesta de Google Sign-In');
      }
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión con Google');
    }
  };

  const isFormValid =
    formData.email.length > 0 &&
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    Object.keys(registerUserValidator(formData.email, formData.password, formData.confirmPassword)).length === 0;

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
          autoComplete="email"
          textContentType="emailAddress"
          placeholderTextColor="#9CA3AF"
          className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
        />
        
        <View className="relative mb-4">
          <TextInput
            placeholder="Contraseña"
            value={formData.password}
            onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
            secureTextEntry={!showPassword}
            autoComplete="new-password"
            textContentType="newPassword"
            placeholderTextColor="#9CA3AF"
            className="border border-gray-200 bg-white rounded-md px-4 py-3 pr-12 font-mont-regular text-gray-900"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(prev => !prev)}
            className="absolute right-3 top-3"
          >
            <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View className="relative mb-6">
          <TextInput
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
            secureTextEntry={!showConfirmPassword}
            autoComplete="new-password"
            textContentType="newPassword"
            placeholderTextColor="#9CA3AF"
            className="border border-gray-200 bg-white rounded-md px-4 py-3 pr-12 font-mont-regular text-gray-900"
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(prev => !prev)}
            className="absolute right-3 top-3"
          >
            <Feather name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        
        <Button 
          variant="primary" 
          onPress={handleRegister}
          loading={loading}
          disabled={!isFormValid || loading}
          className="mb-4 bg-secondary"
        >
          Crear Cuenta
        </Button>

        {error && (
          <Typography variant="body" className="text-red-500 mb-4 text-center">
            {error}
          </Typography>
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