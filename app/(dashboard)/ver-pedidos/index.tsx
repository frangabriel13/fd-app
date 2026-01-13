import { View } from 'react-native';
import OrdersTable from '@/components/tables/OrdersTable';

export default function VerPedidosScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <OrdersTable />
    </View>
  );
}