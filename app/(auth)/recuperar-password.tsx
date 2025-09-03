import { useState } from 'react';
import { router } from 'expo-router';
import { TextInput } from 'react-native';
import { Button, Container, H1, Typography } from '@/components/ui';
import { useAppDispatch } from '@/hooks/redux';
import { forgotPassword } from '@/store/slices/authSlice';
import SuccessModal from '@/components/modals/successModal';

const ForgotPasswordScreen = () => {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleForgotPassword = async () => {
    if(!email) {
      setError('Por favor ingresa tu email');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await dispatch(forgotPassword(email)).unwrap();
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        router.replace('/(auth)/login');
      }, 3000);
    } catch(err: any) {
      setError(err.message || 'Error al enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container type="page" className="justify-center bg-primary">
      {showSuccessModal ? (
        <SuccessModal
          title="¡Correo enviado exitosamente!"
          text="Revisa tu bandeja de entrada para continuar con el proceso de recuperación. Luego, regresa a la aplicación."
        />
      ) : (
        <>
          <H1 className="text-center mb-8 text-white">Recuperar Contraseña</H1>

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

          <Button
            variant="primary"
            onPress={handleForgotPassword}
            loading={loading}
            className="mb-4 rounded-md bg-secondary"
          >
            Enviar
          </Button>

          <Button
            variant="ghost"
            onPress={() => router.push('/(auth)/login')}
            className="text-white"
          >
            Volver
          </Button>
        </>
      )}
    </Container>
  );
};

// const styles = StyleSheet.create({
// });

export default ForgotPasswordScreen;