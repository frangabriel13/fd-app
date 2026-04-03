import { Tabs } from 'expo-router';
import Header from '@/components/header/Header';
import CustomTabBar from '@/components/ui/CustomTabBar';
import { CartAnimationProvider } from '@/contexts/CartAnimationContext';

export default function TabLayout() {
  return (
    <CartAnimationProvider>
      <Header />
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="favoritos" />
        <Tabs.Screen name="Carrito" />
        <Tabs.Screen name="fabricantes" />
        <Tabs.Screen name="more" />

        <Tabs.Screen name="mi-cuenta" options={{ href: null }} />
        <Tabs.Screen name="store/[id]" options={{ href: null }} />
        <Tabs.Screen name="producto/[id]" options={{ href: null }} />
        <Tabs.Screen name="tienda" options={{ href: null }} />
        <Tabs.Screen name="notificaciones" options={{ href: null }} />
        <Tabs.Screen name="seguidos" options={{ href: null }} />
      </Tabs>
    </CartAnimationProvider>
  );
}
