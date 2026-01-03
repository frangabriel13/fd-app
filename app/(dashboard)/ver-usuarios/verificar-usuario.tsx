import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Document {
  id: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  url?: string;
  uploadedAt: string;
}

export default function VerificarUsuarioScreen() {
  const { userId, userName } = useLocalSearchParams<{ userId: string; userName: string }>();
  
  const [documents] = useState<Document[]>([
    {
      id: '1',
      type: 'DNI Frente',
      status: 'pending',
      uploadedAt: '2023-07-20'
    },
    {
      id: '2', 
      type: 'DNI Dorso',
      status: 'pending',
      uploadedAt: '2023-07-20'
    },
    {
      id: '3',
      type: 'Constancia de CUIT',
      status: 'pending',
      uploadedAt: '2023-07-20'
    },
    {
      id: '4',
      type: 'Certificado de Habilitación',
      status: 'pending',
      uploadedAt: '2023-07-20'
    }
  ]);

  const [userInfo] = useState({
    name: userName || 'Usuario',
    email: 'usuario@email.com',
    phone: '+54 11 1234-5678',
    company: 'Empresa S.A.',
    role: 'Mayorista',
    requestedAt: '2023-07-20'
  });

  const handleApprove = () => {
    Alert.alert(
      'Aprobar Usuario',
      `¿Estás seguro de que deseas aprobar a ${userName}? Se activará su cuenta y podrá acceder a la plataforma.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprobar',
          onPress: () => {
            Alert.alert('Aprobado', 'Usuario aprobado correctamente', [
              { text: 'OK', onPress: () => router.back() }
            ]);
          }
        }
      ]
    );
  };

  const handleReject = () => {
    Alert.alert(
      'Rechazar Usuario',
      `¿Estás seguro de que deseas rechazar a ${userName}? Se le enviará una notificación con los motivos del rechazo.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Rechazado', 'Usuario rechazado', [
              { text: 'OK', onPress: () => router.back() }
            ]);
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprobado';
      case 'rejected': return 'Rechazado';
      default: return 'Pendiente';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* User Header */}
        <View className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <View className="flex-row items-center mb-4">
            <View className="w-16 h-16 bg-orange-100 rounded-full items-center justify-center mr-4">
              <Text className="text-orange-600 font-bold text-xl">
                {userInfo.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-bold text-lg">{userInfo.name}</Text>
              <Text className="text-gray-500">Solicitud de {userInfo.role}</Text>
              <Text className="text-gray-500 text-sm">Enviada el {formatDate(userInfo.requestedAt)}</Text>
            </View>
          </View>
          
          <View className="border-t border-gray-100 pt-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Email:</Text>
              <Text className="text-gray-900 font-medium">{userInfo.email}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Teléfono:</Text>
              <Text className="text-gray-900 font-medium">{userInfo.phone}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Empresa:</Text>
              <Text className="text-gray-900 font-medium">{userInfo.company}</Text>
            </View>
          </View>
        </View>

        {/* Documents Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Documentación Enviada</Text>
          
          {documents.map((doc) => (
            <View key={doc.id} className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="document-text" size={20} color="#6b7280" />
                    <Text className="text-gray-900 font-medium ml-2">{doc.type}</Text>
                  </View>
                  <Text className="text-gray-500 text-sm">Subido el {formatDate(doc.uploadedAt)}</Text>
                </View>
                
                <View className="flex-row items-center space-x-2">
                  <View className={`px-3 py-1 rounded-full ${getStatusColor(doc.status)}`}>
                    <Text className="text-sm font-medium">{getStatusText(doc.status)}</Text>
                  </View>
                  
                  <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
                    <Ionicons name="eye" size={18} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Verification Notes */}
        <View className="bg-blue-50 rounded-lg p-4 mb-6">
          <View className="flex-row items-center mb-2">
            <Ionicons name="information-circle" size={20} color="#3b82f6" />
            <Text className="text-blue-900 font-medium ml-2">Notas de Verificación</Text>
          </View>
          <Text className="text-blue-800 text-sm">
            Revisa cuidadosamente todos los documentos antes de aprobar o rechazar la solicitud. 
            Asegúrate de que la información sea legible y coincida con los datos proporcionados.
          </Text>
        </View>

        {/* Actions */}
        <View className="flex-row space-x-3">
          <TouchableOpacity 
            onPress={handleReject}
            className="flex-1 bg-red-600 py-4 rounded-lg items-center flex-row justify-center"
          >
            <Ionicons name="close-circle" size={18} color="white" />
            <Text className="text-white font-semibold ml-2">Rechazar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleApprove}
            className="flex-1 bg-green-600 py-4 rounded-lg items-center flex-row justify-center"
          >
            <Ionicons name="checkmark-circle" size={18} color="white" />
            <Text className="text-white font-semibold ml-2">Aprobar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}