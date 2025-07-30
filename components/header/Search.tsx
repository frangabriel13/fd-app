import { Ionicons } from '@expo/vector-icons';
import { TextInput, View } from 'react-native';

const Search = () => {
  return (
    <View className="flex-1 mx-4">
      <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
        <Ionicons 
          name="search-outline" 
          size={20} 
          color="#021344" 
        />
        <TextInput
          placeholder="Buscaraaaa..."
          placeholderTextColor="#9ca3af"
          className="flex-1 ml-3 font-mont-regular text-primary"
          editable={false} // Deshabilitado ya que no tiene funcionalidad
        />
      </View>
    </View> // Flex-1 para ocupar el espacio disponible y mx-4 para márgenes laterales (separación horizontal)
  );
};


export default Search;