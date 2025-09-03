import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/redux';
import { resendVerificationCode } from '@/store/slices/userSlice';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Container, H1 } from '@/components/ui';
import { Typography } from '@/components/ui/Typography';
import Feather from '@expo/vector-icons/Feather';

const VerifyAccountScreen = () => {
  const dispatch = useAppDispatch();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Verificar que tenemos el email
  useEffect(() => {
    if (!email) {
      setError('Email no encontrado. Por favor vuelve al login.');
    }
  }, [email]);

  const handleInputChange = (value: string, index: number) => {
    if (value.length > 1) return; // Solo permitir un carácter por input
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Mover el foco al siguiente input automáticamente
    if (value && index < 5) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = async () => {
    if (code.some((digit) => digit === '')) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const verificationCode = code.join('');
      console.log('Código de verificación:', verificationCode);

      // Aquí puedes agregar la lógica para verificar el código
      // Ejemplo: await dispatch(verifyAccount(verificationCode)).unwrap();

      router.replace('/(tabs)'); // Navegar si la verificación es exitosa
    } catch (err: any) {
      setError(err.message || 'Error al verificar la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Email no encontrado. Por favor vuelve al login.');
      return;
    }

    setResendLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await dispatch(resendVerificationCode(email)).unwrap();
      setSuccessMessage('Código de verificación reenviado exitosamente');
      console.log('Código reenviado exitosamente');
    } catch (err: any) {
      setError(err || 'Error al reenviar el código');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Container type="page" className="justify-center bg-primary">
      <TouchableOpacity
        onPress={() => router.replace('/(auth)/login')}
        className="absolute top-8 left-4 rounded-full border border-white p-1"
      >
        <Feather name="arrow-left" size={24} color="white" />
      </TouchableOpacity>
      
      <H1 className="text-center mb-8 text-white">Verificar Cuenta</H1>

      {/* Mostrar email para confirmar */}
      {/* {email && (
        <Typography variant="body" className="text-gray-300 mb-4 text-center">
          Comprueba tu bandeja de entrada
        </Typography>
      )} */}

      {/* Inputs para los 6 dígitos */}
      <View className="flex-row justify-center mb-6">
        {code.map((digit, index) => (
          <TextInput
            key={index}
            id={`digit-${index}`}
            value={digit}
            onChangeText={(value) => handleInputChange(value, index)}
            keyboardType="numeric"
            maxLength={1}
            className="border border-gray-200 bg-white rounded-md text-center text-lg font-mont-medium mx-2 w-12 h-12 text-gray-900"
          />
        ))}
      </View>

      <Button
        variant="primary"
        onPress={handleVerify}
        loading={loading}
        className="rounded-md bg-secondary mb-4"
      >
        Verificar Cuenta
      </Button>

      <Button 
        variant="ghost"
        // size='zero'
        onPress={handleResendCode}
        loading={resendLoading}
        className="text-white"
      >
        Reenviar código
      </Button>

      {/* Mostrar mensajes de éxito */}
      {successMessage && (
        <Typography variant="body" className="text-green-400 mb-4 text-center">
          {successMessage}
        </Typography>
      )}

      {/* Mostrar errores si existen */}
      {error && (
        <Typography variant="body" className="text-red-500 mb-4 text-center">
          {error}
        </Typography>
      )}
    </Container>
  );
};


export default VerifyAccountScreen;