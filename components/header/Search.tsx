import { TextInput, View } from 'react-native';

const Search = () => {
  return (
    <View className="flex-1 mx-4">
      <View className="flex-row items-center bg-gray-100 rounded px-0 py-0">
        <TextInput
          placeholder="Buscar productos o fabricantes..."
          placeholderTextColor="#9ca3af"
          className="flex-1 ml-2 font-mont-regular text-primary"
          editable={false} // Deshabilitado ya que no tiene funcionalidad
        />
      </View>
    </View> // Flex-1 para ocupar el espacio disponible y mx-4 para márgenes laterales (separación horizontal)
  );
};


export default Search;