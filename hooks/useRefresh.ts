import { useState, useCallback } from 'react';

/**
 * Encapsula la lógica de pull-to-refresh.
 * @param fetchFn - Función async que recarga los datos de la pantalla.
 * @returns { refreshing, onRefresh } para pasar al RefreshControl.
 *
 * Uso:
 *   const { refreshing, onRefresh } = useRefresh(() => dispatch(getFavorites()));
 *
 *   <FlatList
 *     refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#f86f1a']} />}
 *   />
 */
export const useRefresh = (fetchFn: () => Promise<any> | void) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchFn();
    } finally {
      setRefreshing(false);
    }
  }, [fetchFn]);

  return { refreshing, onRefresh };
};
