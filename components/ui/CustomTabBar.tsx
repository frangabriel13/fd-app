import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import TabBarBadge from './TabBarBadge';
import { useCartBadge } from '@/hooks/useCartBadge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_WIDTH = SCREEN_WIDTH;
const TAB_HEIGHT = 58;

const ACTIVE = '#021344';
const INACTIVE = '#9ca3af';

type TabName = 'index' | 'favoritos' | 'Carrito' | 'fabricantes' | 'more';

const VISIBLE_TABS: TabName[] = ['index', 'favoritos', 'Carrito', 'fabricantes', 'more'];

const TAB_LABELS: Record<TabName, string> = {
  index: 'Inicio',
  favoritos: 'Favoritos',
  Carrito: 'Carrito',
  fabricantes: 'Live',
  more: 'Más',
};

function TabIcon({ name, color, cartCount }: { name: TabName; color: string; cartCount: number }) {
  switch (name) {
    case 'index':
      return <AntDesign name="home" size={24} color={color} />;
    case 'favoritos':
      return <AntDesign name="hearto" size={24} color={color} />;
    case 'Carrito':
      return (
        <TabBarBadge count={cartCount}>
          <AntDesign name="shoppingcart" size={24} color={color} />
        </TabBarBadge>
      );
    case 'fabricantes':
      return (
        <FontAwesome6
          name="wifi"
          size={21}
          color={color}
          style={{ transform: [{ rotate: '45deg' }] }}
        />
      );
    case 'more':
      return <SimpleLineIcons name="menu" size={24} color={color} />;
    default:
      return null;
  }
}

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const cartBadgeCount = useCartBadge();

  const visibleRoutes = state.routes.filter(route =>
    VISIBLE_TABS.includes(route.name as TabName)
  );

  const tabCount = visibleRoutes.length;
  const tabWidth = BAR_WIDTH / tabCount;

  const activeIndex = visibleRoutes.findIndex(
    route => route.key === state.routes[state.index].key
  );


  const handlePress = (route: (typeof visibleRoutes)[0], isFocused: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <View style={styles.container}>
        {visibleRoutes.map((route) => {
          const isFocused = route.key === state.routes[state.index].key;
          const color = isFocused ? ACTIVE : INACTIVE;
          const name = route.name as TabName;

          return (
            <Pressable
              key={route.key}
              style={styles.tab}
              onPress={() => handlePress(route, isFocused)}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={TAB_LABELS[name]}
            >
              <TabIcon name={name} color={color} cartCount={cartBadgeCount} />
              <Text style={[styles.label, isFocused && styles.labelActive]}>
                {TAB_LABELS[name]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  container: {
    flexDirection: 'row',
    width: BAR_WIDTH,
    height: TAB_HEIGHT,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: INACTIVE,
    letterSpacing: 0.1,
  },
  labelActive: {
    color: ACTIVE,
    fontWeight: '700',
  },
});
