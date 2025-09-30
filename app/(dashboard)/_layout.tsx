import { Stack } from 'expo-router';
import BackHeader from '@/components/headers/BackHeader';

const DashboardLayout = () => {
  return (
    <Stack 
      screenOptions={{
        contentStyle: { backgroundColor: "#f3f4f6" },
      }}>
      <Stack.Screen name="perfil" options={{ header: () => <BackHeader /> }} />
    </Stack>
  );
};


export default DashboardLayout;