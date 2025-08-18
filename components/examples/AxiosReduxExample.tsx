// Ejemplo de uso de las instancias de axios y Redux en tu app móvil

import React from 'react';
import { Button, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { manufacturerInstance, productInstance } from '../../services';
import { AppDispatch, RootState } from '../../store';
import { getManufacturerProfile, loginManufacturer, refreshToken } from '../../store/slices/manufacturerSlice';

const ExampleUsage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentManufacturer, loading, error, token } = useSelector(
    (state: RootState) => state.manufacturer
  );

  // Ejemplo 1: Login
  const handleLogin = async () => {
    try {
      await dispatch(loginManufacturer({
        email: 'test@example.com',
        password: 'password123'
      })).unwrap();
      console.log('Login exitoso');
    } catch (error) {
      console.error('Error en login:', error);
    }
  };

  // Ejemplo 2: Obtener perfil
  const handleGetProfile = async () => {
    try {
      await dispatch(getManufacturerProfile()).unwrap();
      console.log('Perfil obtenido');
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
    }
  };

  // Ejemplo 3: Uso directo de instancias axios
  const fetchProducts = async () => {
    try {
      const response = await productInstance.get('/');
      console.log('Productos:', response.data);
    } catch (error) {
      console.error('Error obteniendo productos:', error);
    }
  };

  // Ejemplo 4: Uso de manufacturerInstance
  const createManufacturer = async () => {
    try {
      const response = await manufacturerInstance.post('/', {
        name: 'Nuevo Fabricante',
        email: 'nuevo@example.com'
      });
      console.log('Fabricante creado:', response.data);
    } catch (error) {
      console.error('Error creando fabricante:', error);
    }
  };

  // Ejemplo 5: Refresh token manual
  const handleRefreshToken = async () => {
    try {
      await dispatch(refreshToken()).unwrap();
      console.log('Token renovado');
    } catch (error) {
      console.error('Error renovando token:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Usuario actual: {currentManufacturer?.name || 'No autenticado'}</Text>
      <Text>Token: {token ? 'Disponible' : 'No disponible'}</Text>
      {loading && <Text>Cargando...</Text>}
      {error && <Text style={{ color: 'red' }}>Error: {error}</Text>}
      
      <Button title="Login" onPress={handleLogin} />
      <Button title="Obtener Perfil" onPress={handleGetProfile} />
      <Button title="Obtener Productos" onPress={fetchProducts} />
      <Button title="Crear Fabricante" onPress={createManufacturer} />
      <Button title="Renovar Token" onPress={handleRefreshToken} />
    </View>
  );
};

export default ExampleUsage;
