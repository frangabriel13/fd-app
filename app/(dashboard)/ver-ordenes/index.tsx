import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import SubordersTable from '@/components/tables/SubordersTable';

export default function VerOrdenesScreen() {
  const { subOrderId } = useLocalSearchParams<{ subOrderId?: string }>();

  return (
    <View className="flex-1 bg-gray-50">
      <SubordersTable initialSubOrderId={subOrderId ? Number(subOrderId) : undefined} />
    </View>
  );
}