import { Stack } from 'expo-router';
import BackHeader from '@/components/headers/BackHeader';

const DashboardLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="perfil" options={{ header: () => <BackHeader /> }} />
    </Stack>
  );
};


export default DashboardLayout;