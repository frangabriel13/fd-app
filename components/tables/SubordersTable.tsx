import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { 
  fetchMySubOrders,
  clearMySubOrders
} from '../../store/slices/orderSlice';
import Pagination from './Pagination';
import { formatToARS } from '@/utils/formatters';

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
  order: {
    id: number;
    total: string;
    user: User;
  };
  createdAt?: string;
}

export default function SubordersTable() {
  const dispatch = useAppDispatch();
  const { 
    mySubOrders,
    loadingMySubOrders,
    errorMySubOrders 
  } = useAppSelector(state => state.order);
  
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Cargar datos cuando el componente se monta
  useEffect(() => {
    dispatch(fetchMySubOrders());

    // Cleanup al desmontar el componente
    return () => {
      dispatch(clearMySubOrders());
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

  const getWholesalerName = (subOrder: SubOrder) => {
    if (subOrder.order?.user?.wholesaler?.name) {
      return subOrder.order.user.wholesaler.name;
    }
    return subOrder.order?.user?.email || 'N/A';
  };

  const getWholesalerPhone = (subOrder: SubOrder) => {
    if (subOrder.order?.user?.wholesaler?.phone) {
      return subOrder.order.user.wholesaler.phone;
    }
    return null;
  };

  const handleViewSubOrder = (subOrder: SubOrder) => {
    router.push({
      pathname: '/(dashboard)/ver-ordenes/ver-orden',
      params: { 
        subOrderId: subOrder.id.toString(),
        userName: getWholesalerName(subOrder)
      }
    });
  };

  const handleWhatsApp = (subOrder: SubOrder) => {
    const phone = getWholesalerPhone(subOrder);
    if (!phone) {
      Alert.alert('Error', 'No hay número de teléfono disponible para este usuario');
      return;
    }

    const message = `Hola ${getWholesalerName(subOrder)}, te escribo sobre tu orden #${subOrder.id}`;
    const whatsappUrl = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(whatsappUrl).then(supported => {
      if (supported) {
        Linking.openURL(whatsappUrl);
      } else {
        Alert.alert('Error', 'No se puede abrir WhatsApp. Asegúrate de tenerlo instalado.');
      }
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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

  const renderSubOrderRow = (subOrder: SubOrder) => {
    const statusColors = getStatusColor(subOrder.status);
    
    return (
      <View key={subOrder.id} className="bg-white border-b border-gray-100">
        <View className="flex-row items-center py-3 px-4">
          {/* Name Column */}
          <View className="flex-1">
            <Text className="text-gray-900 font-medium text-base">
              {getWholesalerName(subOrder)}
            </Text>
          </View>
          
          {/* Total Column */}
          <View className="w-24 items-center">
            <Text className="text-gray-700 font-medium text-sm">
              ${formatToARS(subOrder.subtotal)}
            </Text>
          </View>
          
          {/* Creado Column */}
          <View className="w-28 items-center">
            <Text className="text-gray-700 font-medium text-sm">
              {formatDate(subOrder.createdAt)}
            </Text>
          </View>
          
          {/* Actions Column */}
          <View className="w-20 flex-row justify-center items-center gap-2">
            <TouchableOpacity 
              onPress={() => handleViewSubOrder(subOrder)}
              className="p-1"
            >
              <Ionicons name="eye" size={20} color="#3b82f6" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => handleWhatsApp(subOrder)}
              className="p-1"
              disabled={!getWholesalerPhone(subOrder)}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#10b981" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const sortedSubOrders = React.useMemo(() => {
    if (!mySubOrders) return [];
    
    const sorted = [...mySubOrders].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = getWholesalerName(a).toLowerCase();
          bValue = getWholesalerName(b).toLowerCase();
          break;
        case 'createdAt':
          aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0;
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
  }, [mySubOrders, sortBy, sortOrder]);

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
          
          <View className="w-24 items-center">
            <Text className="text-gray-600 font-semibold text-sm">Total</Text>
          </View>
          
          <TouchableOpacity 
            className="w-28 items-center flex-row justify-center"
            onPress={() => handleSort('createdAt')}
          >
            <Text className="text-gray-600 font-semibold text-sm">Creado</Text>
            <View className="ml-1">{getSortIcon('createdAt')}</View>
          </TouchableOpacity>
          
          <View className="w-20 items-center">
            <Text className="text-gray-600 font-semibold text-sm">Actions</Text>
          </View>
        </View>
      </View>

      {/* Table Content */}
      <ScrollView className="flex-1">
        {loadingMySubOrders ? (
          <View className="bg-white p-8 items-center">
            <Text className="text-gray-500 mt-4 text-center">Cargando mis órdenes...</Text>
          </View>
        ) : (sortedSubOrders && sortedSubOrders.length > 0) ? (
          sortedSubOrders.map(renderSubOrderRow)
        ) : (
          <View className="bg-white p-8 items-center">
            <Ionicons name="receipt-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-center">No hay órdenes disponibles</Text>
          </View>
        )}
        
        {errorMySubOrders && (
          <View className="bg-red-50 p-4 m-4 rounded">
            <Text className="text-red-600 text-center">{errorMySubOrders}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}