import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { 
  fetchUnifiedOrders,
  clearUnifiedOrders,
  setUnifiedOrdersPage
} from '../../store/slices/orderSlice';
import Pagination from './Pagination';

// Tipos locales basados en los del slice
interface User {
  id: number;
  email: string;
  wholesaler?: {
    id: number;
    name: string;
    phone: string;
  };
  manufacturer?: {
    id: number;
    name: string;
    phone: string;
  };
}

interface UnifiedOrder {
  id: number;
  unifique: boolean;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  subOrders: any[];
}

export default function UnifiedOrdersTable() {
  const dispatch = useAppDispatch();
  const { 
    unifiedOrders,
    unifiedOrdersTotal,
    unifiedOrdersCurrentPage,
    loadingUnifiedOrders,
    errorUnifiedOrders 
  } = useAppSelector(state => state.order);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const pageSize = 15;

  // Cargar datos cuando el componente se monta
  useEffect(() => {
    dispatch(fetchUnifiedOrders({ 
      page: currentPage, 
      limit: pageSize
    }));

    // Cleanup al desmontar el componente
    return () => {
      dispatch(clearUnifiedOrders());
    };
  }, [dispatch]);

  // Actualizar datos cuando cambia la página
  useEffect(() => {
    dispatch(fetchUnifiedOrders({ 
      page: currentPage, 
      limit: pageSize
    }));
  }, [currentPage, dispatch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    dispatch(setUnifiedOrdersPage(page));
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder(field === 'createdAt' ? 'desc' : 'asc');
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) {
      return <Ionicons name="swap-vertical" size={14} color="#9CA3AF" />;
    }
    return sortOrder === 'asc' 
      ? <Ionicons name="chevron-up" size={14} color="#3B82F6" />
      : <Ionicons name="chevron-down" size={14} color="#3B82F6" />;
  };

  const getUserName = (user: User) => {
    if (user.wholesaler?.name) {
      return user.wholesaler.name;
    }
    if (user.manufacturer?.name) {
      return user.manufacturer.name;
    }
    return user.email;
  };

  const getUserPhone = (user: User) => {
    if (user.wholesaler?.phone) {
      return user.wholesaler.phone;
    }
    if (user.manufacturer?.phone) {
      return user.manufacturer.phone;
    }
    return null;
  };

  const handleViewOrder = (order: UnifiedOrder) => {
    router.push({
      pathname: '/(dashboard)/pedidos-unificados/detalle-pedido',
      params: { 
        orderId: order.id.toString(),
        userName: getUserName(order.user)
      }
    });
  };

  const handleWhatsApp = (order: UnifiedOrder) => {
    const phone = getUserPhone(order.user);
    if (!phone) {
      Alert.alert('Error', 'No hay número de teléfono disponible para este usuario');
      return;
    }

    const message = `Hola ${getUserName(order.user)}, te escribo sobre tu pedido #${order.id}`;
    const whatsappUrl = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(whatsappUrl).then(supported => {
      if (supported) {
        Linking.openURL(whatsappUrl);
      } else {
        Alert.alert('Error', 'No se puede abrir WhatsApp. Asegúrate de tenerlo instalado.');
      }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { bg: '#DCFCE7', text: '#16A34A' };
      case 'pending':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'cancelled':
        return { bg: '#FEE2E2', text: '#DC2626' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const renderOrderRow = (order: UnifiedOrder) => {
    const statusColors = getStatusColor(order.status);
    
    return (
      <View key={order.id} className="bg-white border-b border-gray-100">
        <View className="flex-row items-center py-3 px-4">
          {/* Name Column */}
          <TouchableOpacity className="flex-1 flex-row items-center">
            <View className="flex-1">
              <Text className="text-gray-900 font-medium text-base">
                {getUserName(order.user)}
              </Text>
              <Text className="text-gray-500 text-sm">
                Pedido #{order.id} • {formatCurrency(order.total)}
              </Text>
              <View className="mt-1">
                <View 
                  className="px-2 py-1 rounded-full self-start"
                  style={{ backgroundColor: statusColors.bg }}
                >
                  <Text 
                    className="text-xs font-medium capitalize"
                    style={{ color: statusColors.text }}
                  >
                    {order.status}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          
          {/* Creado Column */}
          <TouchableOpacity className="w-24 items-center">
            <Text className="text-gray-700 font-medium text-sm">
              {formatDate(order.createdAt)}
            </Text>
          </TouchableOpacity>
          
          {/* Actions Column */}
          <View className="w-32 flex-row justify-center space-x-1">
            <TouchableOpacity 
              onPress={() => handleViewOrder(order)}
              className="bg-blue-50 px-2 py-1 rounded flex-row items-center"
            >
              <Ionicons name="eye" size={12} color="#3b82f6" />
              <Text className="text-blue-600 font-medium ml-1 text-xs">Ver</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => handleWhatsApp(order)}
              className="bg-green-50 px-2 py-1 rounded flex-row items-center"
              disabled={!getUserPhone(order.user)}
            >
              <Ionicons name="logo-whatsapp" size={12} color="#10b981" />
              <Text className="text-green-600 font-medium ml-1 text-xs">WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const sortedOrders = React.useMemo(() => {
    if (!unifiedOrders) return [];
    
    const sorted = [...unifiedOrders].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = getUserName(a.user).toLowerCase();
          bValue = getUserName(b.user).toLowerCase();
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
  }, [unifiedOrders, sortBy, sortOrder]);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Table Header */}
      <View className="bg-gray-50 border-b border-gray-200">
        <View className="flex-row items-center py-3 px-4">
          <TouchableOpacity 
            className="flex-1 flex-row items-center"
            onPress={() => handleSort('name')}
          >
            <Text className="text-gray-600 font-semibold text-sm">Name</Text>
            <View className="ml-1">{getSortIcon('name')}</View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="w-24 items-center flex-row justify-center"
            onPress={() => handleSort('createdAt')}
          >
            <Text className="text-gray-600 font-semibold text-sm">Creado</Text>
            <View className="ml-1">{getSortIcon('createdAt')}</View>
          </TouchableOpacity>
          
          <View className="w-32 items-center">
            <Text className="text-gray-600 font-semibold text-sm">Actions</Text>
          </View>
        </View>
      </View>

      {/* Table Content */}
      <ScrollView className="flex-1">
        {loadingUnifiedOrders ? (
          <View className="bg-white p-8 items-center">
            <Text className="text-gray-500 mt-4 text-center">Cargando pedidos unificados...</Text>
          </View>
        ) : (sortedOrders && sortedOrders.length > 0) ? (
          sortedOrders.map(renderOrderRow)
        ) : (
          <View className="bg-white p-8 items-center">
            <Ionicons name="receipt-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-center">No hay pedidos unificados</Text>
          </View>
        )}
        
        {errorUnifiedOrders && (
          <View className="bg-red-50 p-4 m-4 rounded">
            <Text className="text-red-600 text-center">{errorUnifiedOrders}</Text>
          </View>
        )}
      </ScrollView>
      
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={unifiedOrdersTotal || 0}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        loading={loadingUnifiedOrders}
      />
    </View>
  );
}