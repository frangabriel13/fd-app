import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import Header from '@/components/header/Header';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

export default function TabLayout() {
  // const colorScheme = useColorScheme();

  return (
    <>
      <Header />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#f86f1a', // Cambia este color al que prefieras
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
              backgroundColor: '#fff',
            },
            default: {
              backgroundColor: '#fff',
            },
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            // tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
            tabBarIcon: ({ color }) => <AntDesign name="home" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="tienda"
          options={{
            title: 'Tienda',
            // tabBarIcon: ({ color }) => <AntDesign name="shoppingcart" size={28} color={color} />,
            tabBarIcon: ({ color }) => <Ionicons name="storefront-outline" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="carrito"
          options={{
            title: 'Carrito',
            tabBarIcon: ({ color }) => <AntDesign name="shoppingcart" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="favoritos"
          options={{
            title: 'Favoritos',
            tabBarIcon: ({ color }) => <AntDesign name="hearto" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'Más',
            tabBarIcon: ({ color }) => <SimpleLineIcons name="menu" size={28} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}