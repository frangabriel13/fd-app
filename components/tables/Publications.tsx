import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data para mostrar la estructura
const mockProducts = [
  {
    id: 1,
    name: 'Camiseta Básica',
    price: 19.99,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Pantalón Vaquero',
    price: 49.99,
    createdAt: '2024-01-14T15:30:00Z'
  },
  {
    id: 3,
    name: 'Sudadera con Capucha',
    price: 35.50,
    createdAt: '2024-01-13T09:15:00Z'
  },
  {
    id: 4,
    name: 'Zapatillas Deportivas',
    price: 79.99,
    createdAt: '2024-01-12T14:20:00Z'
  },
  {
    id: 5,
    name: 'Chaqueta de Invierno',
    price: 89.99,
    createdAt: '2024-01-11T11:45:00Z'
  }
];

const Publications = () => {
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder(field === 'createdAt' ? 'desc' : 'asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) {
      return <Ionicons name="swap-vertical" size={14} color="#9CA3AF" />;
    }
    return sortOrder === 'asc' 
      ? <Ionicons name="chevron-up" size={14} color="#3B82F6" />
      : <Ionicons name="chevron-down" size={14} color="#3B82F6" />;
  };

  const handleEdit = (productId: number) => {
    Alert.alert('Editar', `Editar producto ID: ${productId}`);
  };

  const handleDelete = (productId: number) => {
    Alert.alert(
      'Eliminar Producto',
      '¿Estás seguro de que deseas eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => console.log('Eliminar:', productId) }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const renderProductRow = (product: typeof mockProducts[0]) => {
    return (
      <View key={product.id} className="bg-white border-b border-gray-100">
        <View className="flex-row items-center py-3 px-4">
          {/* Nombre Column */}
          <TouchableOpacity className="flex-1 flex-row items-center">
            <View className="flex-1">
              <Text className="text-gray-900 font-medium text-base">
                {product.name}
              </Text>
            </View>
          </TouchableOpacity>
          
          {/* Precio Column */}
          <TouchableOpacity className="w-20 items-center">
            <Text className="text-gray-700 font-medium text-sm">
              {formatCurrency(product.price)}
            </Text>
          </TouchableOpacity>
          
          {/* Fecha Column */}
          <TouchableOpacity className="w-24 items-center">
            <Text className="text-gray-700 font-medium text-sm">
              {formatDate(product.createdAt)}
            </Text>
          </TouchableOpacity>
          
          {/* Acciones Column */}
          <View className="w-32 flex-row justify-center space-x-1">
            <TouchableOpacity 
              onPress={() => handleEdit(product.id)}
              className="bg-blue-50 px-2 py-1 rounded flex-row items-center"
            >
              <Ionicons name="create" size={12} color="#3b82f6" />
              <Text className="text-blue-600 font-medium ml-1 text-xs">Editar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => handleDelete(product.id)}
              className="bg-red-50 px-2 py-1 rounded flex-row items-center"
            >
              <Ionicons name="trash" size={12} color="#ef4444" />
              <Text className="text-red-600 font-medium ml-1 text-xs">Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const sortedProducts = React.useMemo(() => {
    const sorted = [...mockProducts].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return sorted;
  }, [mockProducts, sortBy, sortOrder]);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Table Header */}
      <View className="bg-gray-50 border-b border-gray-200">
        <View className="flex-row items-center py-3 px-4">
          <TouchableOpacity 
            className="flex-1 flex-row items-center"
            onPress={() => handleSort('name')}
          >
            <Text className="text-gray-600 font-semibold text-sm">Nombre</Text>
            <View className="ml-1">{getSortIcon('name')}</View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="w-20 items-center flex-row justify-center"
            onPress={() => handleSort('price')}
          >
            <Text className="text-gray-600 font-semibold text-sm">Precio</Text>
            <View className="ml-1">{getSortIcon('price')}</View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="w-24 items-center flex-row justify-center"
            onPress={() => handleSort('createdAt')}
          >
            <Text className="text-gray-600 font-semibold text-sm">Fecha</Text>
            <View className="ml-1">{getSortIcon('createdAt')}</View>
          </TouchableOpacity>
          
          <View className="w-32 items-center">
            <Text className="text-gray-600 font-semibold text-sm">Acciones</Text>
          </View>
        </View>
      </View>

      {/* Table Content */}
      <ScrollView className="flex-1">
        {sortedProducts && sortedProducts.length > 0 ? (
          sortedProducts.map(renderProductRow)
        ) : (
          <View className="bg-white p-8 items-center">
            <Ionicons name="cube-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-center">No hay productos disponibles</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Publications;