import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyProducts, clearMyProducts, deleteProduct, resetDeleteState } from '@/store/slices/productSlice';
import type { AppDispatch, RootState } from '@/store';
import Pagination from '@/components/tables/Pagination';
import { formatToARS } from '@/utils/formatters';

const Publications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { myProducts, myProductsLoading, myProductsPagination, isDeleting, deleteError } = useSelector((state: RootState) => state.product);
  
  const [backendSortBy, setBackendSortBy] = useState<'oldest' | 'price-low' | 'price-high' | 'name-asc' | 'name-desc' | undefined>(undefined);
  const [activeColumn, setActiveColumn] = useState<'name' | 'price' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    dispatch(fetchMyProducts({ page: currentPage, pageSize, sortBy: backendSortBy }));
  }, [dispatch, currentPage, backendSortBy]);

  useEffect(() => {
    return () => {
      dispatch(clearMyProducts());
    };
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (field: 'name' | 'price' | 'createdAt') => {
    let newSortBy: typeof backendSortBy;
    let newSortOrder: 'asc' | 'desc';

    if (activeColumn === field) {
      // Alternar orden en la misma columna
      newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Nueva columna: empezar con orden por defecto
      newSortOrder = field === 'createdAt' ? 'desc' : 'asc';
      setActiveColumn(field);
    }

    // Mapear a los valores del backend
    switch (field) {
      case 'name':
        newSortBy = newSortOrder === 'asc' ? 'name-asc' : 'name-desc';
        break;
      case 'price':
        newSortBy = newSortOrder === 'asc' ? 'price-low' : 'price-high';
        break;
      case 'createdAt':
        newSortBy = newSortOrder === 'asc' ? 'oldest' : undefined; // undefined = más nuevo primero (default)
        break;
    }

    setSortOrder(newSortOrder);
    setBackendSortBy(newSortBy);
    setCurrentPage(1); // Volver a la primera página al cambiar ordenamiento
  };

  const getSortIcon = (field: 'name' | 'price' | 'createdAt') => {
    if (activeColumn !== field) {
      return <Ionicons name="swap-vertical" size={14} color="#9CA3AF" />;
    }
    return sortOrder === 'asc' 
      ? <Ionicons name="chevron-up" size={14} color="#3B82F6" />
      : <Ionicons name="chevron-down" size={14} color="#3B82F6" />;
  };

  const handleEdit = (productId: string) => {
    Alert.alert('Editar', `Editar producto ID: ${productId}`);
  };

  const handleDelete = async (productId: string) => {
    Alert.alert(
      'Eliminar Producto',
      '¿Estás seguro de que deseas eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive', 
          onPress: async () => {
            try {
              const result = await dispatch(deleteProduct(productId)).unwrap();
              Alert.alert('Éxito', 'Producto eliminado correctamente');
            } catch (error: any) {
              Alert.alert('Error', error || 'No se pudo eliminar el producto');
            }
          }
        }
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

  const renderProductRow = (product: typeof myProducts[0]) => {
    return (
      <View key={product.id} className="bg-white border-b border-gray-100">
        <View className="flex-row items-center py-3 px-4">
          {/* Nombre Column */}
          <View className="flex-1">
            <Text className="text-gray-900 font-medium text-base">
              {product.name}
            </Text>
          </View>
          
          {/* Precio Column */}
          <View className="w-24 items-center">
            <Text className="text-gray-700 font-medium text-sm">
              ${formatToARS(product.price)}
            </Text>
          </View>
          
          {/* Creado Column */}
          <View className="w-28 items-center">
            <Text className="text-gray-700 font-medium text-sm">
              {product.createdAt ? formatDate(product.createdAt) : 'N/A'}
            </Text>
          </View>
          
          {/* Acciones Column */}
          <View className="w-20 flex-row justify-center items-center gap-2">
            <TouchableOpacity 
              onPress={() => handleEdit(product.id)}
              className="p-1"
              disabled={isDeleting}
            >
              <Ionicons name="create" size={20} color={isDeleting ? "#9CA3AF" : "#3b82f6"} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => handleDelete(product.id)}
              className="p-1"
              disabled={isDeleting}
            >
              <Ionicons name="trash" size={20} color={isDeleting ? "#9CA3AF" : "#ef4444"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

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
            className="w-24 items-center flex-row justify-center"
            onPress={() => handleSort('price')}
          >
            <Text className="text-gray-600 font-semibold text-sm">Precio</Text>
            <View className="ml-1">{getSortIcon('price')}</View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="w-28 items-center flex-row justify-center"
            onPress={() => handleSort('createdAt')}
          >
            <Text className="text-gray-600 font-semibold text-sm">Creado</Text>
            <View className="ml-1">{getSortIcon('createdAt')}</View>
          </TouchableOpacity>
          
          <View className="w-20 items-center">
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
        ) : myProducts && myProducts.length > 0 ? (
          <>
            {myProducts.map(renderProductRow)}
          </>
        ) : (
          <View className="bg-white p-8 items-center">
            <Ionicons name="cube-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-center">No hay productos disponibles</Text>
          </View>
        )}
      </ScrollView>
      
      {/* Pagination */}
      {myProductsPagination && myProductsPagination.myTotalProducts > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={myProductsPagination.myTotalProducts}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          loading={myProductsLoading}
        />
      )}
    </View>
  );
};

export default Publications;