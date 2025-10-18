import { Stack } from 'expo-router';
import StepHeader from '@/components/headers/StepHeader';

export default function SubirProductoLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#f3f4f6" }
      }}
    >
      <Stack.Screen
        name="seleccionar-categoria"
        options={{
          header: () => <StepHeader title="Elegir categoría" step={1} totalSteps={5} />,
        }}
      />
      <Stack.Screen
        name="elegir-opcion"
        options={{
          header: () => <StepHeader title="Elegir opción" step={2} totalSteps={5} />,
        }}
      />
      <Stack.Screen
        name="seleccionar-genero"
        options={{
          header: () => <StepHeader title="Seleccionar género" step={3} totalSteps={5} />,
        }}
      />
      <Stack.Screen
        name="tipo-articulo"
        options={{
          header: () => <StepHeader title="Tipo de artículo" step={4} totalSteps={5} />,
        }}
      />
      <Stack.Screen
        name="detalle-producto"
        options={{
          header: () => <StepHeader title="Detalles del producto" step={5} totalSteps={5} />,
        }}
      />
    </Stack>
  )
}