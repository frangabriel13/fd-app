import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { H_PADDING, ITEM_GAP } from './constants';

interface SkeletonItemProps {
  size: number;
}

const SkeletonItem = ({ size }: SkeletonItemProps) => {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 550 }),
        withTiming(0.35, { duration: 550 })
      ),
      -1
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.item, animStyle]}>
      <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]} />
      <View style={styles.line} />
    </Animated.View>
  );
};

interface ManufacturerSkeletonProps {
  itemSize: number;
}

const ManufacturerSkeleton = ({ itemSize }: ManufacturerSkeletonProps) => (
  <View style={styles.grid}>
    {Array.from({ length: 12 }).map((_, i) => (
      <SkeletonItem key={i} size={itemSize} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: H_PADDING,
    paddingTop: 16,
    gap: ITEM_GAP,
    rowGap: 20,
    backgroundColor: '#fff',
  },
  item: {
    alignItems: 'center',
    gap: 6,
  },
  circle: {
    backgroundColor: '#e5e7eb',
  },
  line: {
    width: 44,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
});

export default ManufacturerSkeleton;
