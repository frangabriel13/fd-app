import { View } from 'react-native';
import UnifiedOrdersTable from '@/components/tables/UnifiedOrdersTable';

export default function PedidosUnificadosScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <UnifiedOrdersTable />
    </View>
  );
}