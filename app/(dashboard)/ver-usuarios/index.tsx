import React from 'react';
import { View } from 'react-native';
import UsersTable from '@/components/tables/UsersTable';

export default function VerUsuariosScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <UsersTable />
    </View>
  );
}