import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui';
import { spacing } from '@/constants/Styles';
import { Colors } from '@/constants/Colors';

interface StepHeaderProps {
  title: string;
  step: number;
  totalSteps: number;
}

const StepHeader = ({ title, step, totalSteps }: StepHeaderProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 0 }]} className='bg-primary'>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Feather name="arrow-left" size={28} color="white" />
      </TouchableOpacity>
      
      <View style={styles.titleContainer}>
        <Typography variant="h3" className="text-white font-mont-medium">
          {title}
        </Typography>
        {/* <Typography variant="caption" className="text-gray-200">
          Paso {step} de {totalSteps}
        </Typography> */}
      </View>
      
      <View style={styles.spacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.xs,
    // backgroundColor: Colors.blue.default,
  },
  backButton: {
    padding: spacing.xs,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  spacer: {
    width: 40,
  },
});

export default StepHeader;