import { Stack } from "expo-router";
import BackHeader from "@/components/headers/BackHeader";

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="rol"
        options={{
          title: "Seleccionar Rol",
          header: () => <BackHeader title="Seleccionar Rol" />, // Personaliza el header
        }}
      />
      <Stack.Screen
        name="datos-mayorista"
        options={{
          title: "Datos Mayorista",
          header: () => <BackHeader title="Datos Mayorista" />, // Personaliza el header
        }}
      />
      <Stack.Screen
        name="datos-fabricante"
        options={{
          title: "Datos Fabricante",
          header: () => <BackHeader title="Datos Fabricante" />, // Personaliza el header
        }}
      />
      <Stack.Screen
        name="validar-documentos"
        options={{
          title: "Validar Documentos",
          header: () => <BackHeader title="Validar Documentos" />, // Personaliza el header
        }}
      />
    </Stack>
  );
}