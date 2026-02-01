import { Stack } from 'expo-router';
import StepHeader from '@/components/headers/StepHeader';

export default function PedidosLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#f3f4f6" }
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          header: () => <StepHeader title="Mis Publicaciones" />,
        }}
      />
      <Stack.Screen
        name="editar-producto"
        options={{
          header: () => <StepHeader title="Editar Producto" />,
        }}
      />
      <Stack.Screen
        name="ver-pedido"
        options={{
          header: () => <StepHeader title="Editar Producto" />,
        }}
      />
    </Stack>
  )
}