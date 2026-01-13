import { Stack } from 'expo-router'

export default function DashboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#f3f4f6" }
      }}
    >
      <Stack.Screen name="subir-producto" />
      <Stack.Screen name="ver-usuarios" />
      <Stack.Screen name="pedidos-unificados" />
    </Stack>
  )
}