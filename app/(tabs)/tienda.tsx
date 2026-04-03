import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useShop } from '@/hooks/useShop';
import MenuGender from '@/components/shop/MenuGender';
import SelectCategory from '@/components/shop/SelectCategory';
import ShopSearchBanner from '@/components/shop/ShopSearchBanner';
import ShopResultsBar from '@/components/shop/ShopResultsBar';
import ShopProductGrid from '@/components/shop/ShopProductGrid';
import SortModal from '@/components/shop/SortModal';

const ShopScreen = () => {
  const {
    shopProducts, shopPagination, loading, error,
    selectedSort, searchTerm,
    selectedGender, selectedCategory,
    showSortModal, loadingMore,
    setShowSortModal,
    handleGenderChange, handleCategoryChange, handleSortChange, loadMoreProducts,
  } = useShop();

  return (
    <View style={styles.container}>
      <MenuGender selectedGender={selectedGender} onGenderSelect={handleGenderChange} />
      {selectedGender && (
        <SelectCategory
          selectedGenderId={selectedGender}
          selectedCategoryId={selectedCategory ?? undefined}
          onCategorySelect={handleCategoryChange}
        />
      )}
      {searchTerm && (
        <ShopSearchBanner
          searchTerm={searchTerm}
          onClear={() => router.replace('/(tabs)/tienda')}
        />
      )}
      {shopPagination && (
        <ShopResultsBar
          totalProducts={shopPagination.totalProducts}
          selectedSort={selectedSort}
          onOpenSort={() => setShowSortModal(true)}
        />
      )}
      <View style={styles.productsWrapper}>
        <ShopProductGrid
          shopProducts={shopProducts}
          loading={loading}
          error={error}
          loadingMore={loadingMore}
          onLoadMore={loadMoreProducts}
        />
      </View>
      <SortModal
        visible={showSortModal}
        selectedSort={selectedSort}
        onClose={() => setShowSortModal(false)}
        onSortChange={handleSortChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray.light,
  },
  productsWrapper: {
    flex: 1,
  },
});

export default ShopScreen;
