import { View } from 'react-native';
import SubordersTable from '@/components/tables/SubordersTable';

export default function VerOrdenesScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <SubordersTable />
    </View>
  );
}