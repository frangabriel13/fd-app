import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Switch, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EditarUsuarioScreen() {
  const { userId, userName } = useLocalSearchParams<{ userId: string; userName: string }>();
  
  const [formData, setFormData] = useState({
    name: userName || '',
    email: 'usuario@email.com',
    phone: '+54 11 1234-5678',
    isActive: true,
    isVerified: true,
    role: 'Usuario',
    company: 'Empresa S.A.',
    address: 'Av. Corrientes 1234, CABA'
  });

  const handleSave = () => {
    Alert.alert(
      'Guardar Cambios',
      '¿Deseas guardar los cambios realizados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Guardar',
          onPress: () => {
            // Aquí iría la lógica para guardar
            Alert.alert('Éxito', 'Usuario actualizado correctamente', [
              { text: 'OK', onPress: () => router.back() }
            ]);
          }
        }
      ]
    );
  };

  const renderFormField = (label: string, value: string, onChangeText: (text: string) => void, multiline = false) => (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        className={`bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 ${
          multiline ? 'h-20' : 'h-12'
        }`}
        placeholder={`Ingresa ${label.toLowerCase()}`}
      />
    </View>
  );

  const renderSwitchField = (label: string, value: boolean, onValueChange: (value: boolean) => void, description?: string) => (
    <View className="mb-4">
      <View className="bg-white rounded-lg border border-gray-200 p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-gray-900 font-medium">{label}</Text>
            {description && (
              <Text className="text-gray-500 text-sm mt-1">{description}</Text>
            )}
          </View>
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#f3f4f6', true: '#3b82f6' }}
            thumbColor={value ? '#ffffff' : '#f9fafb'}
          />
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header Info */}
        <View className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mr-4">
              <Text className="text-blue-600 font-bold text-xl">
                {formData.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-bold text-lg">{formData.name}</Text>
              <Text className="text-gray-500">ID: {userId}</Text>
            </View>
          </View>
        </View>

        {/* Personal Info */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Información Personal</Text>
          {renderFormField('Nombre Completo', formData.name, (text) => setFormData({...formData, name: text}))}
          {renderFormField('Email', formData.email, (text) => setFormData({...formData, email: text}))}
          {renderFormField('Teléfono', formData.phone, (text) => setFormData({...formData, phone: text}))}
        </View>

        {/* Company Info */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Información de Empresa</Text>
          {renderFormField('Empresa', formData.company, (text) => setFormData({...formData, company: text}))}
          {renderFormField('Dirección', formData.address, (text) => setFormData({...formData, address: text}), true)}
        </View>

        {/* Status Settings */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Estado de la Cuenta</Text>
          {renderSwitchField(
            'Usuario Activo',
            formData.isActive,
            (value) => setFormData({...formData, isActive: value}),
            'Permite al usuario acceder a la plataforma'
          )}
          {renderSwitchField(
            'Cuenta Verificada',
            formData.isVerified,
            (value) => setFormData({...formData, isVerified: value}),
            'Usuario ha completado la verificación de documentos'
          )}
        </View>

        {/* Actions */}
        <View className="flex-row space-x-3 mt-6">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="flex-1 bg-gray-200 py-4 rounded-lg items-center"
          >
            <Text className="text-gray-700 font-semibold">Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleSave}
            className="flex-1 bg-blue-600 py-4 rounded-lg items-center flex-row justify-center"
          >
            <Ionicons name="save" size={18} color="white" />
            <Text className="text-white font-semibold ml-2">Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}