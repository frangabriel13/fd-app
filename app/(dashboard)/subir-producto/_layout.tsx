import { Stack } from 'expo-router'

export default function SubirProductoLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#f3f4f6" }
      }}
    >
      <Stack.Screen
        name="seleccionar-categoria"
      />
      <Stack.Screen
        name="elegir-opcion"
      />
      <Stack.Screen
        name="seleccionar-genero"
      />
      <Stack.Screen
        name="tipo-articulo"
      />
      <Stack.Screen
        name="detalle-producto"
      />
    </Stack>
  )
}