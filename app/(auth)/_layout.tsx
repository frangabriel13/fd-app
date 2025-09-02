import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'Iniciar Sesión',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="registro" 
        options={{ 
          title: 'Crear Cuenta',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="recuperar-password" 
        options={{ 
          title: 'Recuperar Contraseña',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="verificar-cuenta" 
        options={{ 
          title: 'Verificar Cuenta',
          headerShown: false 
        }} 
      />
    </Stack>
  );
}