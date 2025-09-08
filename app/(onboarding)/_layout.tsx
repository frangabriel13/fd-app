import { Stack } from "expo-router";
import BackHeader from "@/components/headers/BackHeader";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#f3f4f6" },
      }}
    >
      <Stack.Screen
        name="rol"
        options={{
          title: "Seleccionar Rol",
          header: () => <BackHeader />, // Personaliza el header
        }}
      />
      <Stack.Screen
        name="datos-mayorista"
        options={{
          title: "Datos Mayorista",
          header: () => <BackHeader />, // Personaliza el header
        }}
      />
      <Stack.Screen
        name="datos-fabricante"
        options={{
          title: "Datos Fabricante",
          header: () => <BackHeader />, // Personaliza el header
        }}
      />
      <Stack.Screen
        name="validar-documentos"
        options={{
          title: "Validar Documentos",
          header: () => <BackHeader />, // Personaliza el header
        }}
      />
    </Stack>
  );
}