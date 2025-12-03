import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product, Manufacturer } from '@/types/product';

interface DetailProductProps {
  product?: Product;
  manufacturer?: Manufacturer;
}

const DetailProduct = ({ product, manufacturer }: DetailProductProps) => {
  return (
    <View className="p-0">
      {/* Categoría y Género */}
      <Text className="text-base font-mont-regular text-gray-600">
        {product?.category.name} | {product?.attributes.genre}
      </Text>
      
      {/* Nombre del producto con iconos de compartir y favorito */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-mont-bold flex-1">
          {product?.name}
        </Text>
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-3">
            <Ionicons name="share-outline" size={26} color="#021344" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={26} color="#f86f1a" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Precio */}
      <Text className="text-2xl font-mont-medium">
        ${product?.price}
      </Text>
      <Text className="text-gray-600 text-base font-mont-regular mb-4">
        Comprando al por mayor
      </Text>
      
      {/* Contacta con fabricante */}
      <View>
        <Text className="text-lg font-mont-medium mb-1">
          Contacta con {manufacturer?.name}:
        </Text>
        <View className="flex-row items-center mb-4">
          {/* Botón WhatsApp */}
          <TouchableOpacity className="bg-green-500 flex-row items-center px-4 py-2 rounded-lg mr-4">
            <Ionicons name="logo-whatsapp" size={20} color="white" />
            <Text className="text-white font-mont-medium ml-2">WhatsApp</Text>
          </TouchableOpacity>
          
          {/* Ubicación del fabricante */}
          <View className="flex-1 bg-gray-100 flex-row items-center rounded-lg">
            <Ionicons name="location-outline" size={20} color="#6b7280" />
            <Text className="text-gray-600 font-mont-regular ml-2 flex-1">
              {manufacturer?.street || 'Dirección no disponible'}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Descripción */}
      <Text className="text-lg font-mont-medium">
        Descripción:
      </Text>
      <View className="bg-gray-50 rounded-lg">
        <Text className="text-gray-700 font-mont-regular">
          {product?.description || 'Sin descripción'}
        </Text>
      </View>
    </View>
  );
};

export default DetailProduct;