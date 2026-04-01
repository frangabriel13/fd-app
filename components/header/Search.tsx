import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import useSearch from './useSearch';
import SearchDropdown from './SearchDropdown';

const inputStyle = {
  fontSize: 14,
  lineHeight: 18,
  color: '#1a1a1a',
  paddingVertical: 0,
  includeFontPadding: false,
  textAlignVertical: 'center' as const,
};

interface SearchProps {
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

const Search = memo(function Search({ isExpanded, onExpandChange }: SearchProps) {
  const {
    searchText,
    setSearchText,
    showResults,
    searchLoading,
    textInputRef,
    products,
    manufacturers,
    hasResults,
    showEmpty,
    handleCancel,
    handleFocus,
    handleBlur,
    handleSearchNavigation,
    handleProductPress,
    handleManufacturerPress,
  } = useSearch({ onExpandChange });

  return (
    <View className="flex-1 z-50">
      <View className="flex-row items-center bg-white rounded-lg h-10 px-2.5">
        {isExpanded ? (
          <TouchableOpacity onPress={handleCancel} className="mr-1 p-0.5">
            <Ionicons name="arrow-back" size={20} color={Colors.gray.semiDark} />
          </TouchableOpacity>
        ) : (
          <Ionicons name="search" size={16} color={Colors.gray.default} style={{ marginRight: 2 }} />
        )}
        <TextInput
          ref={textInputRef}
          placeholder="Buscar productos o fabricantes..."
          placeholderTextColor={Colors.gray.default}
          className="flex-1 px-1.5 font-mont-regular"
          style={inputStyle}
          value={searchText}
          onChangeText={setSearchText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
          onSubmitEditing={() => {
            if (searchText.trim()) handleSearchNavigation();
          }}
        />
        {searchLoading && (
          <ActivityIndicator size="small" color={Colors.gray.semiDark} style={{ marginLeft: 4 }} />
        )}
      </View>

      {showResults && isExpanded && (
        <SearchDropdown
          searchText={searchText}
          products={products}
          manufacturers={manufacturers}
          hasResults={hasResults}
          showEmpty={showEmpty}
          onProductPress={handleProductPress}
          onManufacturerPress={handleManufacturerPress}
          onSeeAll={handleSearchNavigation}
        />
      )}
    </View>
  );
});

export default Search;
