import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isActive: boolean;
  isLive?: boolean;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ana García',
    email: 'ana@email.com',
    createdAt: '2023-05-22',
    isActive: true,
    isLive: true
  },
  {
    id: '2',
    name: 'Carlos López',
    email: 'carlos@email.com',
    createdAt: '2023-06-15',
    isActive: true,
    isLive: false
  },
  {
    id: '3',
    name: 'María Rodríguez',
    email: 'maria@email.com',
    createdAt: '2023-07-01',
    isActive: false,
    isLive: false
  },
  {
    id: '4',
    name: 'Pedro Martínez',
    email: 'pedro@email.com',
    createdAt: '2023-07-20',
    isActive: false,
    isLive: false
  },
];

export default function UsersTable() {
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');

  const activeUsers = mockUsers.filter(user => user.isActive);
  const pendingUsers = mockUsers.filter(user => !user.isActive);

  const handleEdit = (user: User) => {
    router.push({
      pathname: '/editar-usuario',
      params: { userId: user.id, userName: user.name }
    });
  };

  const handleDelete = (user: User) => {
    Alert.alert(
      'Eliminar Usuario',
      `¿Estás seguro de que deseas eliminar a ${user.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive' }
      ]
    );
  };

  const handleVerify = (user: User) => {
    router.push({
      pathname: '/verificar-usuario',
      params: { userId: user.id, userName: user.name }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderUserRow = (user: User) => (
    <View key={user.id} className="bg-white border-b border-gray-100">
      <View className="flex-row items-center py-3 px-4">
        {/* Name Column */}
        <TouchableOpacity className="flex-1 flex-row items-center">
          <View className="flex-1">
            <Text className="text-gray-900 font-medium text-base">
              {user.name}
            </Text>
          </View>
        </TouchableOpacity>
        
        {/* Creado Column */}
        <TouchableOpacity className="w-24 items-center">
          <Text className="text-gray-700 font-medium text-sm">
            {formatDate(user.createdAt)}
          </Text>
        </TouchableOpacity>
        
        {/* Actions Column */}
        <View className="w-32 flex-row justify-center space-x-1">
          {user.isActive ? (
            <>
              <TouchableOpacity 
                onPress={() => handleEdit(user)}
                className="bg-blue-50 px-2 py-1 rounded flex-row items-center"
              >
                <Ionicons name="pencil" size={12} color="#3b82f6" />
                <Text className="text-blue-600 font-medium ml-1 text-xs">Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => handleDelete(user)}
                className="bg-red-50 px-2 py-1 rounded flex-row items-center"
              >
                <Ionicons name="trash" size={12} color="#ef4444" />
                <Text className="text-red-600 font-medium ml-1 text-xs">Del</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              onPress={() => handleVerify(user)}
              className="bg-green-50 px-3 py-1 rounded flex-row items-center"
            >
              <Ionicons name="checkmark-circle" size={12} color="#10b981" />
              <Text className="text-green-600 font-medium ml-1 text-xs">Verify</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Live Column */}
        <TouchableOpacity className="w-12 items-center">
          {user.isActive && user.isLive ? (
            <View className="w-3 h-3 bg-red-500 rounded-full" />
          ) : (
            <View className="w-3 h-3 bg-gray-300 rounded-full" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Tab Navigation */}
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row">
          <TouchableOpacity 
            onPress={() => setActiveTab('active')}
            className={`flex-1 py-4 items-center border-b-2 ${
              activeTab === 'active' ? 'border-blue-500' : 'border-transparent'
            }`}
          >
            <Text className={`font-semibold ${
              activeTab === 'active' ? 'text-blue-600' : 'text-gray-500'
            }`}>
              Activos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setActiveTab('pending')}
            className={`flex-1 py-4 items-center border-b-2 ${
              activeTab === 'pending' ? 'border-blue-500' : 'border-transparent'
            }`}
          >
            <Text className={`font-semibold ${
              activeTab === 'pending' ? 'text-blue-600' : 'text-gray-500'
            }`}>
              Pendientes
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">
        {/* Table Header */}
        <View className="bg-gray-50 border-b border-gray-200">
          <View className="flex-row items-center py-3 px-4">
            <TouchableOpacity className="flex-1">
              <Text className="text-gray-600 font-semibold text-sm">Name</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="w-24 items-center">
              <Text className="text-gray-600 font-semibold text-sm">Creado</Text>
            </TouchableOpacity>
            
            <View className="w-32 items-center">
              <Text className="text-gray-600 font-semibold text-sm">Actions</Text>
            </View>
            
            <TouchableOpacity className="w-12 items-center">
              <Text className="text-gray-600 font-semibold text-sm">Live</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Table Content */}
        <ScrollView className="flex-1">
          {activeTab === 'active' ? (
            activeUsers.length > 0 ? (
              activeUsers.map(renderUserRow)
            ) : (
              <View className="bg-white p-8 items-center">
                <Ionicons name="people-outline" size={48} color="#d1d5db" />
                <Text className="text-gray-500 mt-4 text-center">No hay usuarios activos</Text>
              </View>
            )
          ) : (
            pendingUsers.length > 0 ? (
              pendingUsers.map(renderUserRow)
            ) : (
              <View className="bg-white p-8 items-center">
                <Ionicons name="time-outline" size={48} color="#d1d5db" />
                <Text className="text-gray-500 mt-4 text-center">No hay usuarios pendientes</Text>
              </View>
            )
          )}
        </ScrollView>
      </View>
    </View>
  );
}