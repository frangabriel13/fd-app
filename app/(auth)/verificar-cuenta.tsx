import { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '@/hooks/redux';
import { resendVerificationCode, verifyAccount } from '@/store/slices/userSlice';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Container, H1 } from '@/components/ui';
import { Typography } from '@/components/ui/Typography';
import Feather from '@expo/vector-icons/Feather';
import SuccessModal from '@/components/modals/successModal';

const VerifyAccountScreen = () => {
  const dispatch = useAppDispatch();
  const { email } = useLocalSearchParams<{ email: string }>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.replace('/(auth)/login');
    }
  }, [email]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleInputChange = (value: string, index: number) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newCode = [...code];
      digits.forEach((d, i) => { if (index + i < 6) newCode[index + i] = d; });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
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
      await dispatch(verifyAccount({ email: email as string, code: verificationCode })).unwrap();

      setShowSuccessModal(true);
      timeoutRef.current = setTimeout(() => {
        setShowSuccessModal(false);
        router.replace('/(auth)/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Error al verificar la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      router.replace('/(auth)/login');
      return;
    }

    setResendLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await dispatch(resendVerificationCode(email)).unwrap();
      setSuccessMessage('Código de verificación reenviado exitosamente');
    } catch (err: any) {
      setError(err.message || 'Error al reenviar el código');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Container type="page" className="justify-center bg-primary">
      {showSuccessModal ? (
      <SuccessModal
        title="¡Email verificado correctamente!"
        text="Serás redirigido a la pantalla de inicio de sesión en unos segundos..."
      />
    ) : (
      <>
        <TouchableOpacity
          onPress={() => router.replace('/(auth)/login')}
          className="absolute top-8 left-4 rounded-full border border-white p-1"
        >
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>

        <H1 className="text-center mb-8 text-white">Verificar Cuenta</H1>

        {email && (
          <Typography variant="body" className="text-gray-300 mb-4 text-center">
            Ingresa el código de 6 dígitos enviado a {email}
          </Typography>
        )}

        <View className="flex-row justify-center mb-6">
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              value={digit}
              onChangeText={(value) => handleInputChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="numeric"
              className="border border-gray-200 bg-white rounded-md text-center text-lg font-mont-medium mx-2 w-12 h-12 text-gray-900"
            />
          ))}
        </View>

        <Button
          variant="primary"
          onPress={handleVerify}
          loading={loading}
          disabled={!email || loading}
          className="rounded-md bg-secondary mb-4"
        >
          Verificar Cuenta
        </Button>

        <Button
          variant="ghost"
          onPress={handleResendCode}
          loading={resendLoading}
          disabled={!email || resendLoading}
          className="text-white"
        >
          Reenviar código
        </Button>

        {successMessage && (
          <Typography variant="body" className="text-green-400 mb-4 text-center">
            {successMessage}
          </Typography>
        )}

        {error && (
          <Typography variant="body" className="text-red-500 mb-4 text-center">
            {error}
          </Typography>
        )}
      </>
    )}
    </Container>
  );
};


export default VerifyAccountScreen;