import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyProducts, clearMyProducts } from '@/store/slices/productSlice';
import type { AppDispatch, RootState } from '@/store';

const Publications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { myProducts, myProductsLoading, myProductsPagination } = useSelector((state: RootState) => state.product);
  
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    dispatch(fetchMyProducts({ page: 1, pageSize: 50 }));
    
    return () => {
      dispatch(clearMyProducts());
    };
  }, [dispatch]);

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

  const handleEdit = (productId: string) => {
    Alert.alert('Editar', `Editar producto ID: ${productId}`);
  };

  const handleDelete = (productId: string) => {
    Alert.alert(
      'Eliminar Producto',
      '¿Estás seguro de que deseas eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => console.log('Eliminar:', productId) }
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const renderProductRow = (product: typeof myProducts[0]) => {
    return (
      <View key={product.id} className="bg-white border-b border-gray-100">
        <View className="flex-row items-center py-3 px-4">
          {/* Nombre Column */}
          <TouchableOpacity className="flex-1 flex-row items-center">
            <View className="flex-1">
              <Text className="text-gray-900 font-medium text-base">
                {product.name}
              </Text>
              {product.description && (
                <Text className="text-gray-500 text-xs mt-1" numberOfLines={1}>
                  {product.description}
                </Text>
              )}
            </View>
          </TouchableOpacity>
          
          {/* Precio Column */}
          <TouchableOpacity className="w-20 items-center">
            <Text className="text-gray-700 font-medium text-sm">
              {formatCurrency(product.price)}
            </Text>
            {product.onSale && (
              <Text className="text-green-600 text-xs">En oferta</Text>
            )}
          </TouchableOpacity>
          
          {/* Categoría Column */}
          <TouchableOpacity className="w-24 items-center">
            <Text className="text-gray-700 font-medium text-sm" numberOfLines={1}>
              {product.category?.name || 'Sin categoría'}
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
    if (!myProducts || myProducts.length === 0) return [];
    
    const sorted = [...myProducts].sort((a, b) => {
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
        case 'category':
          aValue = a.category?.name?.toLowerCase() || '';
          bValue = b.category?.name?.toLowerCase() || '';
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
  }, [myProducts, sortBy, sortOrder]);

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
            onPress={() => handleSort('category')}
          >
            <Text className="text-gray-600 font-semibold text-sm">Categoría</Text>
            <View className="ml-1">{getSortIcon('category')}</View>
          </TouchableOpacity>
          
          <View className="w-32 items-center">
            <Text className="text-gray-600 font-semibold text-sm">Acciones</Text>
          </View>
        </View>
      </View>

      {/* Table Content */}
      <ScrollView className="flex-1">
        {myProductsLoading ? (
          <View className="bg-white p-8 items-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-gray-500 mt-4">Cargando productos...</Text>
          </View>
        ) : sortedProducts && sortedProducts.length > 0 ? (
          <>
            {sortedProducts.map(renderProductRow)}
            {myProductsPagination && (
              <View className="bg-white p-4 items-center border-t border-gray-200">
                <Text className="text-gray-600 text-sm">
                  Total: {myProductsPagination.myTotalProducts} productos
                </Text>
              </View>
            )}
          </>
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