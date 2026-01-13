import { Stack } from 'expo-router';
import StepHeader from '@/components/headers/StepHeader';

export default function PedidosUnificadosLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#f3f4f6" }
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          header: () => <StepHeader title="Pedidos Unificados" />,
        }}
      />
      <Stack.Screen
        name="ver-orden"
        options={{
          header: () => <StepHeader title="Visualizar Orden" />,
        }}
      />
    </Stack>
  )
}