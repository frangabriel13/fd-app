import React, { memo, useCallback, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import TabBarBadge from './TabBarBadge';
import { useCartBadge } from '@/hooks/useCartBadge';
import { Colors } from '@/constants/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_COUNT = 5;
const TAB_WIDTH = SCREEN_WIDTH / TAB_COUNT;
const TAB_HEIGHT = 64;
const INDICATOR_HEIGHT = 3;

const ACTIVE = Colors.blue.dark;
const INACTIVE = Colors.gray.default;

// Configuración de spring compartida con el resto de la app
const SPRING_CONFIG = { damping: 20, stiffness: 300 };

type TabName = 'index' | 'favoritos' | 'carrito' | 'fabricantes' | 'more';

const VISIBLE_TABS: TabName[] = ['index', 'favoritos', 'carrito', 'fabricantes', 'more'];

const TAB_LABELS: Record<TabName, string> = {
  index: 'Inicio',
  favoritos: 'Favoritos',
  carrito: 'Carrito',
  fabricantes: 'Live',
  more: 'Más',
};

// ─── Icono del tab "Live" con punto indicador ───────────────────────────────

function LiveIcon({ color, isFocused }: { color: string; isFocused: boolean }) {
  const dotOpacity = useSharedValue(isFocused ? 1 : 0.4);

  useEffect(() => {
    dotOpacity.value = withTiming(isFocused ? 1 : 0.4, { duration: 200 });
  }, [isFocused]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
  }));

  return (
    <View style={styles.liveIconWrapper}>
      <FontAwesome6
        name="wifi"
        size={21}
        color={color}
        style={styles.liveIcon}
      />
      <Animated.View style={[styles.liveDot, dotStyle]} />
    </View>
  );
}

// ─── Icono genérico por tab ─────────────────────────────────────────────────

function TabIcon({
  name,
  color,
  cartCount,
  isFocused,
}: {
  name: TabName;
  color: string;
  cartCount: number;
  isFocused: boolean;
}) {
  switch (name) {
    case 'index':
      return <AntDesign name="home" size={23} color={color} />;
    case 'favoritos':
      return <AntDesign name="hearto" size={23} color={color} />;
    case 'carrito':
      return (
        <TabBarBadge count={cartCount}>
          <AntDesign name="shoppingcart" size={23} color={color} />
        </TabBarBadge>
      );
    case 'fabricantes':
      return <LiveIcon color={color} isFocused={isFocused} />;
    case 'more':
      return <SimpleLineIcons name="menu" size={23} color={color} />;
    default:
      return null;
  }
}

// ─── Componente individual de tab ───────────────────────────────────────────

type TabItemProps = {
  name: TabName;
  isFocused: boolean;
  cartCount: number;
  onPress: () => void;
};

const TabItem = memo(function TabItem({ name, isFocused, cartCount, onPress }: TabItemProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.88, SPRING_CONFIG);
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, []);

  const color = isFocused ? ACTIVE : INACTIVE;

  return (
    <Pressable
      style={styles.tab}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={TAB_LABELS[name]}
    >
      <Animated.View style={[styles.tabContent, animatedStyle]}>
        <TabIcon name={name} color={color} cartCount={cartCount} isFocused={isFocused} />
        <Text style={[styles.label, isFocused ? styles.labelActive : styles.labelInactive]}>
          {TAB_LABELS[name]}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

// ─── Tab bar principal ───────────────────────────────────────────────────────

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const cartBadgeCount = useCartBadge();

  const visibleRoutes = state.routes.filter(route =>
    VISIBLE_TABS.includes(route.name as TabName)
  );

  const activeIndex = visibleRoutes.findIndex(
    route => route.key === state.routes[state.index].key
  );

  // Indicador deslizante animado
  const indicatorX = useSharedValue(activeIndex * TAB_WIDTH);

  useEffect(() => {
    indicatorX.value = withSpring(activeIndex * TAB_WIDTH, SPRING_CONFIG);
  }, [activeIndex]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  const handlePress = useCallback(
    (route: (typeof visibleRoutes)[0], isFocused: boolean) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    },
    [navigation]
  );

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      {/* Indicador deslizante superior */}
      <Animated.View style={[styles.indicator, { width: TAB_WIDTH }, indicatorStyle]} />

      <View style={styles.container}>
        {visibleRoutes.map((route) => {
          const isFocused = route.key === state.routes[state.index].key;
          const name = route.name as TabName;

          return (
            <TabItem
              key={route.key}
              name={name}
              isFocused={isFocused}
              cartCount={cartBadgeCount}
              onPress={() => handlePress(route, isFocused)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    // Sombra superior en lugar de borde plano
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 12,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: INDICATOR_HEIGHT,
    backgroundColor: ACTIVE,
    borderBottomLeftRadius: INDICATOR_HEIGHT,
    borderBottomRightRadius: INDICATOR_HEIGHT,
  },
  container: {
    flexDirection: 'row',
    width: SCREEN_WIDTH,
    height: TAB_HEIGHT,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
  labelActive: {
    color: ACTIVE,
    fontWeight: '700',
  },
  labelInactive: {
    color: INACTIVE,
    fontWeight: '500',
  },
  liveIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveIcon: {
    transform: [{ rotate: '45deg' }],
  },
  liveDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
});
