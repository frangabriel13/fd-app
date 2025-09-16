import { Button, Container, H2, Input, PhoneInput, Typography} from '@/components/ui';
import { View, Text, StyleSheet } from 'react-native';
import Images from '@/constants/Images';

const ValidateDocumentsScreen = () => {
  return (
    <Container type="page" style={styles.container}>
      <View style={styles.content}>
        <H2>Subir documentación</H2>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    gap: 30,
  },
});


export default ValidateDocumentsScreen;