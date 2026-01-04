import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  loading = false
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = totalPages > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const canGoPrevious = currentPage > 1 && !loading;
  const canGoNext = currentPage < totalPages && !loading;

  const handlePrevious = () => {
    if (canGoPrevious) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (!loading && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getVisiblePages = () => {
    const visiblePages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Lógica más compleja para páginas con ellipsis
      const leftSiblings = Math.floor((maxVisiblePages - 3) / 2);
      const rightSiblings = Math.floor((maxVisiblePages - 3) / 2);
      
      if (currentPage <= leftSiblings + 2) {
        // Cerca del inicio
        for (let i = 1; i <= maxVisiblePages - 1; i++) {
          visiblePages.push(i);
        }
        visiblePages.push('ellipsis');
        visiblePages.push(totalPages);
      } else if (currentPage >= totalPages - rightSiblings - 1) {
        // Cerca del final
        visiblePages.push(1);
        visiblePages.push('ellipsis');
        for (let i = totalPages - maxVisiblePages + 2; i <= totalPages; i++) {
          visiblePages.push(i);
        }
      } else {
        // En el medio
        visiblePages.push(1);
        visiblePages.push('ellipsis');
        for (let i = currentPage - leftSiblings; i <= currentPage + rightSiblings; i++) {
          visiblePages.push(i);
        }
        visiblePages.push('ellipsis');
        visiblePages.push(totalPages);
      }
    }
    
    return visiblePages;
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <View className="bg-white border-t border-gray-200 px-4 py-3">
      {/* Info Row */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-sm text-gray-700">
          Mostrando {startItem} a {endItem} de {totalItems} resultados
        </Text>
        
        {loading && (
          <Text className="text-sm text-blue-600">Cargando...</Text>
        )}
      </View>

      {/* Pagination Controls */}
      <View className="flex-row justify-between items-center">
        {/* Previous Button */}
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={!canGoPrevious}
          className={`flex-row items-center px-3 py-2 rounded-md ${
            canGoPrevious
              ? 'bg-white border border-gray-300'
              : 'bg-gray-100 border border-gray-200'
          }`}
        >
          <Ionicons 
            name="chevron-back" 
            size={16} 
            color={canGoPrevious ? '#374151' : '#9CA3AF'} 
          />
          <Text className={`ml-1 text-sm ${
            canGoPrevious ? 'text-gray-700' : 'text-gray-400'
          }`}>
            Anterior
          </Text>
        </TouchableOpacity>

        {/* Page Numbers */}
        <View className="flex-row space-x-1">
          {getVisiblePages().map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <View key={`ellipsis-${index}`} className="px-3 py-2">
                  <Text className="text-gray-400">...</Text>
                </View>
              );
            }
            
            const isCurrentPage = page === currentPage;
            
            return (
              <TouchableOpacity
                key={page}
                onPress={() => handlePageClick(page)}
                disabled={loading || isCurrentPage}
                className={`px-3 py-2 rounded-md min-w-[40px] items-center ${
                  isCurrentPage
                    ? 'bg-blue-600 border border-blue-600'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  isCurrentPage ? 'text-white' : 'text-gray-700'
                }`}>
                  {page}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          disabled={!canGoNext}
          className={`flex-row items-center px-3 py-2 rounded-md ${
            canGoNext
              ? 'bg-white border border-gray-300'
              : 'bg-gray-100 border border-gray-200'
          }`}
        >
          <Text className={`mr-1 text-sm ${
            canGoNext ? 'text-gray-700' : 'text-gray-400'
          }`}>
            Siguiente
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={16} 
            color={canGoNext ? '#374151' : '#9CA3AF'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}