import { View, Text, StyleSheet, Image } from 'react-native';

interface LiveAccountProps {
  image?: string;
  name?: string;
}

const LiveAccount = ({ image, name }: LiveAccountProps) => {
  return (
    <View style={styles.container}>
      {image && (
        <Image 
          source={{ uri: image }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <Text style={styles.text}>
        {name ? `Fabricante: ${name}` : 'LiveAccount'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});


export default LiveAccount;