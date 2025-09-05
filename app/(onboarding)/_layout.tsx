import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="rol"
        options={{
          title: "Seleccionar Rol",
          headerShown: false
        }}
      />
      <Stack.Screen
        name="datos-mayorista"
        options={{
          title: "Datos Mayorista",
          headerShown: false
        }}
      />
      <Stack.Screen
        name="datos-fabricante"
        options={{
          title: "Datos Fabricante",
          headerShown: false
        }}
      />
      <Stack.Screen
        name="validar-documentos"
        options={{
          title: "Validar Documentos",
          headerShown: false
        }}
      />
    </Stack>
  )
}