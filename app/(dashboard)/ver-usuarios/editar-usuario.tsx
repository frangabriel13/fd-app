import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EditarUsuarioScreen() {
  const { userId, userName, street: initialStreet } = useLocalSearchParams<{ 
    userId: string; 
    userName: string; 
    street: string; 
  }>();
  
  const [street, setStreet] = useState(initialStreet || '');

  const handleSave = () => {
    Alert.alert(
      'Guardar Cambios',
      '¿Deseas guardar la nueva dirección?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Guardar',
          onPress: () => {
            // TODO: Aquí se conectará con el slice para guardar los cambios
            console.log('Guardando dirección:', street);
            Alert.alert('Éxito', 'Dirección actualizada correctamente', [
              { text: 'OK', onPress: () => router.back() }
            ]);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Editable Address Section */}
          <View className="mb-6">
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Dirección del fabricante </Text>
              <TextInput
                value={street}
                onChangeText={setStreet}
                multiline
                numberOfLines={3}
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 h-20"
                placeholder="Ingresa la dirección completa"
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View className="bg-white border-t border-gray-200 px-4 py-3">
        <TouchableOpacity 
          onPress={handleSave}
          className="bg-primary-600 py-4 rounded-lg items-center flex-row justify-center"
        >
          <Text className="text-white font-semibold ml-2">Guardar Cambios</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}