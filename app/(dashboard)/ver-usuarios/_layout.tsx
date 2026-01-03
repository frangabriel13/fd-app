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
          headerTitle: "Gestión de Usuarios",
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
            color: '#1f2937'
          },
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