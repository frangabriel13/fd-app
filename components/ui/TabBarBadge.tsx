import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { Colors } from '@/constants/Colors';
import { useCartAnimationContext } from '@/contexts/CartAnimationContext';

interface TabBarBadgeProps {
  count: number;
  children: React.ReactNode;
}

const TabBarBadge: React.FC<TabBarBadgeProps> = ({ count, children }) => {
  const { isAnimating } = useCartAnimationContext();
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const pulseAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAnimating) {
      // Animación de bounce/scale
      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Animación de pulse en el badge
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isAnimating]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
        {children}
      </Animated.View>
      {count > 0 && (
        <Animated.View style={[
          styles.badge,
          {
            transform: [{ scale: Animated.add(1, pulseAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.3],
            })) }],
            backgroundColor: pulseAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [Colors.general.error, '#ff4444'],
            }),
          }
        ]}>
          <Text style={styles.badgeText}>
            {count > 99 ? '99+' : count.toString()}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.general.error,
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default TabBarBadge;