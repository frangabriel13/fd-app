import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { Container } from '@/components/ui';

interface StoreData {
  id: string;
  name: string;
  description: string;
  image?: string;
  // Agrega más propiedades según necesites
}

const StoreScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función para cargar los datos del fabricante/store usando el ID
    const loadStoreData = async () => {
      try {
        setLoading(true);
        // Aquí harías la llamada a la API para obtener los datos del fabricante
        // const response = await getManufacturerById(id);
        // setStoreData(response.data);
        
        console.log('Store ID:', id);
        // Por ahora, datos mock para desarrollo
        setStoreData({
          id: id || '',
          name: 'Nombre del Store',
          description: 'Descripción del store',
          // ... otros datos del store
        });
      } catch (error) {
        console.error('Error loading store data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadStoreData();
    }
  }, [id]);

  if (loading) {
    return (
      <Container type="page">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Cargando...</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container type="page">
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
          Store ID: {id}
        </Text>
        {storeData && (
          <View>
            <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>
              {storeData.name}
            </Text>
            <Text style={{ fontSize: 16, color: '#666' }}>
              {storeData.description}
            </Text>
            {/* Agregar más componentes según necesites */}
          </View>
        )}
      </View>
    </Container>
  );
};


export default StoreScreen;