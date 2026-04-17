import { Stack } from 'expo-router';
import StepHeader from '@/components/headers/StepHeader';

export default function EstadisticasLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: '#f3f4f6' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          header: () => <StepHeader title="Estadísticas" />,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          header: () => <StepHeader title="Detalle de visitas" />,
        }}
      />
    </Stack>
  );
}
