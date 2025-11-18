import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
// import { useAuth } from '@/hooks/useAuth';

import { HapticTab } from '@/components/HapticTab';
import Header from '@/components/header/Header';
import TabBarBackground from '@/components/ui/TabBarBackground';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

export default function TabLayout() {
  // const colorScheme = useColorScheme();
  // useAuth();
  
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
          name="favoritos"
          options={{
            title: 'Favoritos',
            tabBarIcon: ({ color }) => <AntDesign name="hearto" size={28} color={color} />,
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
          name="fabricantes"
          options={{
            title: 'Live Shopping',
            tabBarIcon: ({ color }) => <FontAwesome6 name="wifi" size={24} color={color} style={{ transform: [{ rotate: '45deg' }] }} />,
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'Más',
            tabBarIcon: ({ color }) => <SimpleLineIcons name="menu" size={28} color={color} />,
          }}
        />

        <Tabs.Screen
          name="mi-cuenta"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="store/[id]"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}