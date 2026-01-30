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
          header: () => <StepHeader title="Mis compras" />,
        }}
      />
      <Stack.Screen
        name="ver-pedido"
        options={{
          header: () => <StepHeader title="Visualizar Pedido" />,
        }}
      />
    </Stack>
  )
}