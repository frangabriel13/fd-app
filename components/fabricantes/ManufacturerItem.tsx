import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import type { LiveManufacturer } from '@/store/slices/manufacturerSlice';
import Images from '@/constants/Images';

const logoDefault = Images.defaultImages.logoDefault;

interface ManufacturerItemProps {
  item: LiveManufacturer;
  avatarSize: number;
  onPress: () => void;
}

const ManufacturerItem = ({ item, avatarSize, onPress }: ManufacturerItemProps) => {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = () => scale.value = withSpring(0.88, { damping: 15, stiffness: 300 });
  const handlePressOut = () => scale.value = withSpring(1, { damping: 15, stiffness: 300 });

  const ringSize = avatarSize + 6;
  const outerRingSize = avatarSize + 14;

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.item, animStyle]}>
        <View style={[styles.avatarWrapper, { width: outerRingSize, height: outerRingSize }]}>
          {item.live && (
            <View style={[styles.ringOuter, {
              width: outerRingSize,
              height: outerRingSize,
              borderRadius: outerRingSize / 2,
            }]} />
          )}
          <View style={[
            styles.ring,
            { width: ringSize, height: ringSize, borderRadius: ringSize / 2 },
            item.live ? styles.ringLive : styles.ringDefault,
          ]}>
            <Image
              source={item.image ? { uri: item.image } : logoDefault}
              style={[styles.avatar, { borderRadius: avatarSize / 2 }]}
              contentFit={item.image ? 'cover' : 'contain'}
              transition={200}
            />
          </View>
        </View>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {item.name}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    gap: 6,
  },
  avatarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  ring: {
    borderWidth: 2.5,
    padding: 2,
    backgroundColor: '#fff',
  },
  ringLive: {
    borderColor: '#ef4444',
  },
  ringDefault: {
    borderColor: '#e5e7eb',
  },
  avatar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6',
  },
  name: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 13,
  },
});

export default ManufacturerItem;
