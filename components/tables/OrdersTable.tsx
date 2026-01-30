import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { 
  fetchMyOrders,
  clearMyOrders
} from '../../store/slices/orderSlice';

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

interface SubOrder {
  id: number;
  subtotal: number;
  status: string;
  products: any[];
  packs: any[];
  user: User;
}

interface Order {
  id: number;
  unifique: boolean;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  subOrders: SubOrder[];
}

export default function OrdersTable() {
  const dispatch = useAppDispatch();
  const { 
    myOrders,
    loadingMyOrders,
    errorMyOrders 
  } = useAppSelector(state => state.order);
  
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Cargar datos cuando el componente se monta
  useEffect(() => {
    dispatch(fetchMyOrders());

    // Cleanup al desmontar el componente
    return () => {
      dispatch(clearMyOrders());
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

  const handleViewOrder = (order: Order) => {
    router.push({
      pathname: '/(dashboard)/ver-pedidos/ver-pedido',
      params: { 
        orderId: order.id.toString(),
        userName: getUserName(order.user)
      }
    });
  };

  const handleWhatsApp = (order: Order) => {
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

  const renderOrderRow = (order: Order) => {
    const statusColors = getStatusColor(order.status);
    
    return (
      <View key={order.id} className="bg-white border-b border-gray-100">
        <View className="flex-row items-center py-3 px-4">
          {/* Name Column */}
          <View className="flex-1">
            <Text className="text-gray-900 font-medium text-base">
              {order.subOrders?.[0]?.user ? getUserName(order.subOrders[0].user) : 'N/A'}
            </Text>
          </View>
          
          {/* Total Column */}
          <View className="w-20 items-center">
            <Text className="text-gray-700 font-medium text-sm">
              {formatCurrency(order.total)}
            </Text>
          </View>
          
          {/* Creado Column */}
          <View className="w-20 items-center">
            <Text className="text-gray-700 font-medium text-sm">
              {formatDate(order.createdAt)}
            </Text>
          </View>
          
          {/* Actions Column */}
          <View className="w-16 flex-row justify-center items-center gap-2">
            <TouchableOpacity 
              onPress={() => handleViewOrder(order)}
              className="p-1"
            >
              <Ionicons name="eye" size={20} color="#3b82f6" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => handleWhatsApp(order)}
              className="p-1"
              disabled={!getUserPhone(order.user)}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#10b981" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const sortedOrders = React.useMemo(() => {
    if (!myOrders) return [];
    
    const sorted = [...myOrders].sort((a, b) => {
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
  }, [myOrders, sortBy, sortOrder]);

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
          
          <View className="w-20 items-center">
            <Text className="text-gray-600 font-semibold text-sm">Total</Text>
          </View>
          
          <TouchableOpacity 
            className="w-20 items-center flex-row justify-center"
            onPress={() => handleSort('createdAt')}
          >
            <Text className="text-gray-600 font-semibold text-sm">Creado</Text>
            <View className="ml-1">{getSortIcon('createdAt')}</View>
          </TouchableOpacity>
          
          <View className="w-16 items-center">
            <Text className="text-gray-600 font-semibold text-sm">Actions</Text>
          </View>
        </View>
      </View>

      {/* Table Content */}
      <ScrollView className="flex-1">
        {loadingMyOrders ? (
          <View className="bg-white p-8 items-center">
            <Text className="text-gray-500 mt-4 text-center">Cargando mis pedidos...</Text>
          </View>
        ) : (sortedOrders && sortedOrders.length > 0) ? (
          sortedOrders.map(renderOrderRow)
        ) : (
          <View className="bg-white p-8 items-center">
            <Ionicons name="receipt-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-center">No hay pedidos disponibles</Text>
          </View>
        )}
        
        {errorMyOrders && (
          <View className="bg-red-50 p-4 m-4 rounded">
            <Text className="text-red-600 text-center">{errorMyOrders}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}