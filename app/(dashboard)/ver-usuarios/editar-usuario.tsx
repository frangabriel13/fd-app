import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, SafeAreaView, Switch, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { updateManufacturerByAdmin, getManufacturerById, clearSelectedManufacturer } from '@/store/slices/manufacturerSlice';

type SubscriptionPlan = 'free' | 'basic' | 'premium';

export default function EditarUsuarioScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, loadingDetail, selectedManufacturer } = useSelector((state: RootState) => state.manufacturer);
  
  const { userId, userName } = useLocalSearchParams<{ 
    userId: string; 
    userName: string; 
  }>();
  
  const [street, setStreet] = useState('');
  const [pointOfSale, setPointOfSale] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>('free');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Cargar los datos completos del fabricante
    if (userId) {
      dispatch(getManufacturerById(parseInt(userId)));
    }

    // Cleanup al desmontar el componente
    return () => {
      dispatch(clearSelectedManufacturer());
    };
  }, [userId, dispatch]);

  useEffect(() => {
    // Inicializar los estados cuando se carguen los datos del fabricante
    if (selectedManufacturer && !isInitialized) {
      setStreet(selectedManufacturer.street || '');
      setPointOfSale(selectedManufacturer.pointOfSale || false);
      
      // Obtener el plan de suscripción (el backend ya filtra por status 'active')
      const activeSub = selectedManufacturer.subscriptions?.[0]; // Solo llegan las activas del backend
      const plan = activeSub?.plan || selectedManufacturer.subscriptionPlan || 'free';
      
      console.log('Subscriptions:', selectedManufacturer.subscriptions);
      console.log('Active Sub:', activeSub);
      console.log('Selected Plan:', plan);
      
      setSubscriptionPlan(plan);
      setIsInitialized(true);
    }
  }, [selectedManufacturer, isInitialized]);

  const handlePointOfSaleChange = (value: boolean) => {
    setPointOfSale(value);
    // Si se desactiva el punto de venta, limpiar la dirección
    if (!value) {
      setStreet('');
    }
  };

  const handleSave = async () => {
    // Solo validar dirección si tiene punto de venta
    if (pointOfSale && !street.trim()) {
      Alert.alert('Error', 'La dirección no puede estar vacía cuando tiene punto de venta');
      return;
    }

    Alert.alert(
      'Guardar Cambios',
      '¿Deseas guardar los cambios realizados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Guardar',
          onPress: async () => {
            try {
              await dispatch(updateManufacturerByAdmin({
                id: parseInt(userId),
                street: pointOfSale ? street : null,
                pointOfSale,
                subscriptionPlan
              })).unwrap();
              
              Alert.alert('Éxito', 'Fabricante actualizado correctamente', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error: any) {
              Alert.alert('Error', error || 'No se pudo actualizar el fabricante');
            }
          }
        }
      ]
    );
  };

  if (loadingDetail) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-4">Cargando datos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Header Info */}
          <View className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
            <Text className="text-lg font-semibold text-gray-900 mb-1">
              {selectedManufacturer?.name || userName}
            </Text>
            <Text className="text-sm text-gray-500">
              ID: {userId}
            </Text>
          </View>

          {/* Point of Sale Section */}
          <View className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-1 mr-4">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  Punto de Venta
                </Text>
                <Text className="text-sm text-gray-500">
                  ¿Tiene tienda física?
                </Text>
              </View>
              <Switch
                value={pointOfSale}
                onValueChange={handlePointOfSaleChange}
                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                thumbColor={pointOfSale ? '#ffffff' : '#f3f4f6'}
              />
            </View>

            {/* Address Section - Solo visible si tiene punto de venta */}
            {pointOfSale && (
              <>
                <View className="border-t border-gray-200 pt-3">
                  <Text className="text-base font-semibold text-gray-900 mb-2">
                    Dirección del Local
                  </Text>
                  <TextInput
                    value={street}
                    onChangeText={setStreet}
                    multiline
                    numberOfLines={3}
                    className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                    placeholder="Ej: Av. Principal 123, Centro"
                    textAlignVertical="top"
                    style={{ minHeight: 80 }}
                  />
                </View>
              </>
            )}
          </View>

          {/* Subscription Plan Section */}
          <View className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Plan de Suscripción
            </Text>
            
            {/* Free Plan */}
            <TouchableOpacity
              onPress={() => setSubscriptionPlan('free')}
              className={`rounded-lg p-4 mb-3 border-2 ${
                subscriptionPlan === 'free' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 bg-white'
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Ionicons 
                      name="gift-outline" 
                      size={20} 
                      color={subscriptionPlan === 'free' ? '#3b82f6' : '#6b7280'} 
                    />
                    <Text className={`text-lg font-semibold ml-2 ${
                      subscriptionPlan === 'free' ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      Free
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-500">
                    Plan básico gratuito
                  </Text>
                </View>
                {subscriptionPlan === 'free' && (
                  <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
                )}
              </View>
            </TouchableOpacity>

            {/* Basic Plan */}
            <TouchableOpacity
              onPress={() => setSubscriptionPlan('basic')}
              className={`rounded-lg p-4 mb-3 border-2 ${
                subscriptionPlan === 'basic' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 bg-white'
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Ionicons 
                      name="star-outline" 
                      size={20} 
                      color={subscriptionPlan === 'basic' ? '#22c55e' : '#6b7280'} 
                    />
                    <Text className={`text-lg font-semibold ml-2 ${
                      subscriptionPlan === 'basic' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      Basic
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-500">
                    Funciones estándar
                  </Text>
                </View>
                {subscriptionPlan === 'basic' && (
                  <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                )}
              </View>
            </TouchableOpacity>

            {/* Premium Plan */}
            <TouchableOpacity
              onPress={() => setSubscriptionPlan('premium')}
              className={`rounded-lg p-4 border-2 ${
                subscriptionPlan === 'premium' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 bg-white'
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Ionicons 
                      name="diamond-outline" 
                      size={20} 
                      color={subscriptionPlan === 'premium' ? '#a855f7' : '#6b7280'} 
                    />
                    <Text className={`text-lg font-semibold ml-2 ${
                      subscriptionPlan === 'premium' ? 'text-purple-600' : 'text-gray-900'
                    }`}>
                      Premium
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-500">
                    Todas las funciones incluidas
                  </Text>
                </View>
                {subscriptionPlan === 'premium' && (
                  <Ionicons name="checkmark-circle" size={24} color="#a855f7" />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View className="bg-white border-t border-gray-200 px-4 py-3">
        <TouchableOpacity 
          onPress={handleSave}
          disabled={loading}
          className={`py-4 rounded-lg items-center flex-row justify-center ${
            loading ? 'bg-gray-400' : 'bg-blue-600'
          }`}
        >
          {loading ? (
            <>
              <ActivityIndicator color="#ffffff" size="small" />
              <Text className="text-white font-semibold ml-2">Guardando...</Text>
            </>
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#ffffff" />
              <Text className="text-white font-semibold ml-2">Guardar Cambios</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}