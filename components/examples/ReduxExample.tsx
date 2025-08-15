import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { clearUser, setUser } from '../../store/slices/userSlice';

const ReduxExample = () => {
  const dispatch = useAppDispatch();
  const { currentUser, isLoading } = useAppSelector((state) => state.user);

  const handleLogin = () => {
    dispatch(setUser({
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com'
    }));
  };

  const handleLogout = () => {
    dispatch(clearUser());
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Redux Example
      </Text>
      
      {currentUser ? (
        <View>
          <Text>Usuario: {currentUser.name}</Text>
          <Text>Email: {currentUser.email}</Text>
          <TouchableOpacity 
            onPress={handleLogout}
            style={{ 
              backgroundColor: 'red', 
              padding: 10, 
              marginTop: 10,
              borderRadius: 5
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>
              Cerrar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text>No hay usuario logueado</Text>
          <TouchableOpacity 
            onPress={handleLogin}
            style={{ 
              backgroundColor: 'blue', 
              padding: 10, 
              marginTop: 10,
              borderRadius: 5
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>
              Iniciar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {isLoading && <Text>Cargando...</Text>}
    </View>
  );
};

export default ReduxExample;
