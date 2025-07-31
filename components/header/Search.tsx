import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface SearchProps {
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

const Search = ({ isExpanded, onExpandChange }: SearchProps) => {
  const [searchText, setSearchText] = useState('');
  const textInputRef = useRef<TextInput>(null);

  const handleFocus = () => {
    onExpandChange(true);
  };

  const handleBlur = () => {
    if (searchText === '') {
      onExpandChange(false);
    }
  };

  const handleCancel = () => {
    setSearchText('');
    textInputRef.current?.blur(); // Forzar que pierda el foco
    onExpandChange(false);
  };

  return (
    <View className={`flex-row items-center ${isExpanded ? 'flex-1' : 'flex-1 mx-4'}`}>
      <View className="flex-1 flex-row items-center bg-gray-100 rounded px-0 py-0">
        {isExpanded && (
          <TouchableOpacity 
            onPress={handleCancel}
            className="ml-2 mr-1 p-1"
          >
            <Ionicons name="arrow-back" size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
        <TextInput
          ref={textInputRef}
          placeholder="Buscar productos o fabricantes..."
          placeholderTextColor="#9ca3af"
          className={`flex-1 font-mont-regular text-primary ${isExpanded ? 'ml-1' : 'ml-2'}`}
          value={searchText}
          onChangeText={setSearchText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
          onSubmitEditing={() => {
            console.log('Buscar:', searchText);
            // Aquí irá tu lógica de búsqueda
          }}
        />
      </View>
    </View> // Flex-1 para ocupar el espacio disponible y mx-4 para márgenes laterales (separación horizontal)
  );
};


export default Search;