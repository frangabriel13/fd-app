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
    </Stack>
  )
}