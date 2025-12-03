import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product, Manufacturer } from '@/types/product';

interface DetailProductProps {
  product?: Product;
  manufacturer?: Manufacturer;
}

const DetailProduct = ({ product, manufacturer }: DetailProductProps) => {
  return (
    <View className="p-4">
      {/* Categoría y Género */}
      <Text className="text-gray-600 text-sm font-mont-regular mb-3">
        {product?.category.name} | {product?.attributes.genre}
      </Text>
      
      {/* Nombre del producto con iconos de compartir y favorito */}
      <View className="flex-row justify-between items-start mb-4">
        <Text className="text-xl font-mont-bold text-primary flex-1 mr-4">
          {product?.name}
        </Text>
        <View className="flex-row">
          <TouchableOpacity className="mr-3">
            <Ionicons name="share-outline" size={24} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Precio */}
      <Text className="text-2xl font-mont-bold text-primary mb-1">
        ${product?.price}
      </Text>
      <Text className="text-gray-600 text-sm font-mont-regular mb-6">
        Comprando al por mayor
      </Text>
      
      {/* Contacta con fabricante */}
      <Text className="text-lg font-mont-medium text-primary mb-3">
        Contacta con {manufacturer?.name}:
      </Text>
      
      <View className="flex-row items-center mb-6">
        {/* Botón WhatsApp */}
        <TouchableOpacity className="bg-green-500 flex-row items-center px-4 py-2 rounded-lg mr-4">
          <Ionicons name="logo-whatsapp" size={20} color="white" />
          <Text className="text-white font-mont-medium ml-2">WhatsApp</Text>
        </TouchableOpacity>
        
        {/* Ubicación del fabricante */}
        <View className="flex-1 bg-gray-100 flex-row items-center p-3 rounded-lg">
          <Ionicons name="location-outline" size={20} color="#6b7280" />
          <Text className="text-gray-600 font-mont-regular ml-2 flex-1">
            {manufacturer?.street || 'Dirección no disponible'}
          </Text>
        </View>
      </View>
      
      {/* Descripción */}
      <Text className="text-lg font-mont-medium text-primary mb-3">
        Descripción:
      </Text>
      <View className="bg-gray-50 p-4 rounded-lg">
        <Text className="text-gray-700 font-mont-regular leading-6">
          {product?.description || 'Sin descripción'}
        </Text>
      </View>
    </View>
  );
};

export default DetailProduct;