import { Stack } from 'expo-router';
import StepHeader from '@/components/headers/StepHeader';

export default function VerUsuariosLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#f3f4f6" }
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          header: () => <StepHeader title="Gestión de Usuarios" />,
        }}
      />
      <Stack.Screen
        name="editar-usuario"
        options={{
          header: () => <StepHeader title="Editar Usuario" />,
        }}
      />
      <Stack.Screen
        name="verificar-usuario"
        options={{
          header: () => <StepHeader title="Verificar Usuario" />,
        }}
      />
    </Stack>
  )
}