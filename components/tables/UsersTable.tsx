import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { 
  fetchApprovedManufacturers, 
  fetchPendingManufacturers,
  toggleLiveManufacturer,
  clearApprovedManufacturers,
  clearPendingManufacturers 
} from '../../store/slices/manufacturerSlice';
import Pagination from './Pagination';

// Tipos locales basados en los del slice
interface ApprovedManufacturer {
  id: number;
  name: string;
  createdAt: string;
  live: boolean;
  userId: number;
}

interface PendingManufacturer {
  id: number;
  name: string;
  createdAt: string;
  userId: number;
  verificationStatus: string;
}

export default function UsersTable() {
  const dispatch = useAppDispatch();
  const { 
    approvedManufacturers,
    approvedManufacturersTotal,
    loadingApproved,
    pendingManufacturers,
    pendingManufacturersTotal,
    loadingPending,
    error 
  } = useAppSelector(state => state.manufacturer);
  
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');
  const [currentPageApproved, setCurrentPageApproved] = useState(1);
  const [currentPagePending, setCurrentPagePending] = useState(1);
  // Estados de ordenamiento para fabricantes activos
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  // Estados de ordenamiento para fabricantes pendientes
  const [sortByPending, setSortByPending] = useState('createdAt');
  const [sortOrderPending, setSortOrderPending] = useState<'asc' | 'desc'>('desc');
  const pageSize = 15;

  // Cargar datos cuando el componente se monta
  useEffect(() => {
    dispatch(fetchApprovedManufacturers({ 
      page: currentPageApproved, 
      pageSize, 
      sortBy, 
      sortOrder 
    }));
    dispatch(fetchPendingManufacturers({ 
      page: currentPagePending, 
      pageSize, 
      sortBy: sortByPending, 
      sortOrder: sortOrderPending 
    }));

    // Cleanup al desmontar el componente
    return () => {
      dispatch(clearApprovedManufacturers());
      dispatch(clearPendingManufacturers());
    };
  }, [dispatch]);

  // Actualizar datos cuando cambia la página de aprobados
  useEffect(() => {
    if (activeTab === 'active') {
      dispatch(fetchApprovedManufacturers({ 
        page: currentPageApproved, 
        pageSize, 
        sortBy, 
        sortOrder 
      }));
    }
  }, [currentPageApproved, dispatch, activeTab, sortBy, sortOrder]);

  // Actualizar datos cuando cambia la página de pendientes
  useEffect(() => {
    if (activeTab === 'pending') {
      dispatch(fetchPendingManufacturers({ 
        page: currentPagePending, 
        pageSize, 
        sortBy: sortByPending, 
        sortOrder: sortOrderPending 
      }));
    }
  }, [currentPagePending, dispatch, activeTab, sortByPending, sortOrderPending]);

  const activeUsers = approvedManufacturers || [];
  const pendingUsers = pendingManufacturers || [];

  const handlePageChangeApproved = (page: number) => {
    setCurrentPageApproved(page);
  };

  const handlePageChangePending = (page: number) => {
    setCurrentPagePending(page);
  };

  const handleSort = (field: string) => {
    if (activeTab === 'active') {
      // Manejo para fabricantes activos
      if (sortBy === field) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(field);
        setSortOrder('asc');
      }
      setCurrentPageApproved(1);
    } else {
      // Manejo para fabricantes pendientes
      if (sortByPending === field) {
        setSortOrderPending(sortOrderPending === 'asc' ? 'desc' : 'asc');
      } else {
        setSortByPending(field);
        setSortOrderPending(field === 'verificationStatus' ? 'desc' : 'asc'); // pending primero por defecto
      }
      setCurrentPagePending(1);
    }
  };

  const getSortIcon = (field: string) => {
    const currentSortBy = activeTab === 'active' ? sortBy : sortByPending;
    const currentSortOrder = activeTab === 'active' ? sortOrder : sortOrderPending;
    
    if (currentSortBy !== field) {
      return <Ionicons name="swap-vertical" size={14} color="#9CA3AF" />;
    }
    return currentSortOrder === 'asc' 
      ? <Ionicons name="chevron-up" size={14} color="#3B82F6" />
      : <Ionicons name="chevron-down" size={14} color="#3B82F6" />;
  };

  const handleEdit = (manufacturer: ApprovedManufacturer | PendingManufacturer) => {
    router.push({
      pathname: '/editar-usuario',
      params: { userId: manufacturer.id.toString(), userName: manufacturer.name }
    });
  };

  const handleDelete = (manufacturer: ApprovedManufacturer | PendingManufacturer) => {
    Alert.alert(
      'Eliminar Fabricante',
      `¿Estás seguro de que deseas eliminar a ${manufacturer.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive' }
      ]
    );
  };

  const handleVerify = (manufacturer: PendingManufacturer) => {
    router.push({
      pathname: '/verificar-usuario',
      params: { userId: manufacturer.id.toString(), userName: manufacturer.name }
    });
  };

  const handleToggleLive = (manufacturer: ApprovedManufacturer) => {
    const action = manufacturer.live ? 'desactivar' : 'activar';
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} Estado Live`,
      `¿Estás seguro de que deseas ${action} el estado live de ${manufacturer.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: action.charAt(0).toUpperCase() + action.slice(1), 
          onPress: () => {
            dispatch(toggleLiveManufacturer(manufacturer.id));
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

  const renderUserRow = (manufacturer: ApprovedManufacturer | PendingManufacturer) => {
    const isApproved = 'live' in manufacturer; // ApprovedManufacturer tiene el campo 'live'
    
    return (
      <View key={manufacturer.id} className="bg-white border-b border-gray-100">
        <View className="flex-row items-center py-3 px-4">
          {/* Name Column */}
          <TouchableOpacity className="flex-1 flex-row items-center">
            <View className="flex-1">
              <Text className="text-gray-900 font-medium text-base">
                {manufacturer.name}
              </Text>
            </View>
          </TouchableOpacity>
          
          {/* Creado Column */}
          <TouchableOpacity className="w-24 items-center">
            <Text className="text-gray-700 font-medium text-sm">
              {formatDate(manufacturer.createdAt)}
            </Text>
          </TouchableOpacity>
          
          {/* Actions Column */}
          <View className="w-32 flex-row justify-center space-x-1">
            {isApproved ? (
              <>
                <TouchableOpacity 
                  onPress={() => handleEdit(manufacturer)}
                  className="bg-blue-50 px-2 py-1 rounded flex-row items-center"
                >
                  <Ionicons name="pencil" size={12} color="#3b82f6" />
                  <Text className="text-blue-600 font-medium ml-1 text-xs">Edit</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => handleDelete(manufacturer)}
                  className="bg-red-50 px-2 py-1 rounded flex-row items-center"
                >
                  <Ionicons name="trash" size={12} color="#ef4444" />
                  <Text className="text-red-600 font-medium ml-1 text-xs">Del</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity 
                onPress={() => handleVerify(manufacturer as PendingManufacturer)}
                className="bg-green-50 px-3 py-1 rounded flex-row items-center"
              >
                <Ionicons name="checkmark-circle" size={12} color="#10b981" />
                <Text className="text-green-600 font-medium ml-1 text-xs">Verify</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Live/Estado Column */}
          <TouchableOpacity 
            className={isApproved ? "w-12 items-center" : "w-20 items-center"}
            onPress={isApproved ? () => handleToggleLive(manufacturer as ApprovedManufacturer) : undefined}
            disabled={!isApproved}
          >
            {isApproved ? (
              // Para fabricantes aprobados: mostrar estado live clickeable
              (manufacturer as ApprovedManufacturer).live ? (
                <View className="w-3 h-3 bg-red-500 rounded-full" />
              ) : (
                <View className="w-3 h-3 bg-gray-300 rounded-full" />
              )
            ) : (
              // Para fabricantes pendientes: mostrar verificationStatus
              <View className="px-2 py-1 rounded-full min-w-[60px] items-center" 
                style={{
                  backgroundColor: (manufacturer as PendingManufacturer).verificationStatus === 'pending' 
                    ? '#FEF3C7' : '#F3F4F6'
                }}
              >
                <Text className="text-xs font-medium" 
                  style={{
                    color: (manufacturer as PendingManufacturer).verificationStatus === 'pending' 
                      ? '#D97706' : '#6B7280'
                  }}
                >
                  {(manufacturer as PendingManufacturer).verificationStatus === 'pending' ? 'Pendiente' : 'No iniciado'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
            
            <TouchableOpacity 
              className={activeTab === 'active' ? "w-12 items-center flex-row justify-center" : "w-20 items-center flex-row justify-center"}
              onPress={() => handleSort(activeTab === 'active' ? 'live' : 'verificationStatus')}
            >
              <Text className="text-gray-600 font-semibold text-sm">
                {activeTab === 'active' ? 'Live' : 'Estado'}
              </Text>
              <View className="ml-1">
                {getSortIcon(activeTab === 'active' ? 'live' : 'verificationStatus')}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Table Content */}
        <ScrollView className="flex-1">
          {activeTab === 'active' ? (
            loadingApproved ? (
              <View className="bg-white p-8 items-center">
                <Text className="text-gray-500 mt-4 text-center">Cargando fabricantes aprobados...</Text>
              </View>
            ) : (activeUsers && activeUsers.length > 0) ? (
              activeUsers.map(renderUserRow)
            ) : (
              <View className="bg-white p-8 items-center">
                <Ionicons name="people-outline" size={48} color="#d1d5db" />
                <Text className="text-gray-500 mt-4 text-center">No hay fabricantes aprobados</Text>
              </View>
            )
          ) : (
            loadingPending ? (
              <View className="bg-white p-8 items-center">
                <Text className="text-gray-500 mt-4 text-center">Cargando fabricantes pendientes...</Text>
              </View>
            ) : (pendingUsers && pendingUsers.length > 0) ? (
              pendingUsers.map(renderUserRow)
            ) : (
              <View className="bg-white p-8 items-center">
                <Ionicons name="time-outline" size={48} color="#d1d5db" />
                <Text className="text-gray-500 mt-4 text-center">No hay fabricantes pendientes</Text>
              </View>
            )
          )}
          
          {error && (
            <View className="bg-red-50 p-4 m-4 rounded">
              <Text className="text-red-600 text-center">{error}</Text>
            </View>
          )}
        </ScrollView>
        
        {/* Pagination */}
        {activeTab === 'active' ? (
          <Pagination
            currentPage={currentPageApproved}
            totalItems={approvedManufacturersTotal || 0}
            pageSize={pageSize}
            onPageChange={handlePageChangeApproved}
            loading={loadingApproved}
          />
        ) : (
          <Pagination
            currentPage={currentPagePending}
            totalItems={pendingManufacturersTotal || 0}
            pageSize={pageSize}
            onPageChange={handlePageChangePending}
            loading={loadingPending}
          />
        )}
      </View>
    </View>
  );
}