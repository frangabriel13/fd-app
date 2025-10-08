import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { spacing, borderRadius, fontSize } from '../../constants/Styles';
import { Colors } from '../../constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';

interface LiveAccountProps {
  image?: string;
  live?: boolean;
}

const LiveAccount = ({ image, live }: LiveAccountProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {image ? (
          <Image 
            source={{ uri: image }} 
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <AntDesign name="upload" size={32} color={Colors.light.icon} />
          </View>
        )}
        
        <TouchableOpacity 
          style={[
            styles.liveButton, 
            { backgroundColor: live ? '#ff4444' : '#666666' }
          ]}
          activeOpacity={0.8}
        >
          <Text style={styles.liveText}>LIVE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.light.tint,
  },
  placeholderContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.light.tint,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveButton: {
    position: 'absolute',
    bottom: -8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  liveText: {
    color: '#ffffff',
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LiveAccount;