import { useState } from 'react';
import { Button, Container, H2, Typography} from '@/components/ui';
import { View, StyleSheet, ScrollView } from 'react-native';
import Images from '@/constants/Images';
import DocumentCard from '@/components/documents/DocumentCard';

const ValidateDocumentsScreen = () => {
  const [uploadedDocuments] = useState({
    selfie: false,
    dniFront: false,
    dniBack: false,
  });

  const handleDocumentPress = (documentType: 'selfie' | 'dniFront' | 'dniBack') => {
    console.log(`Pressed ${documentType}`);
    // Aquí irá la funcionalidad de subir documentos
  };

  const allDocumentsUploaded = Object.values(uploadedDocuments).every(Boolean);

  return (
    <Container type="page" style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View>
            <H2 style={styles.title}>Subir documentación</H2>
            <Typography variant="body" style={styles.description}>
              Para verificar tu identidad, necesitamos que subas los siguientes documentos:
            </Typography>
          </View>

          <View style={styles.documentsContainer}>
            <DocumentCard
              title="Selfie con documento"
              subtitle="Foto tuya sosteniendo tu DNI"
              image={Images.documentsImages.selfie}
              onPress={() => handleDocumentPress('selfie')}
              isUploaded={uploadedDocuments.selfie}
            />
            
            <DocumentCard
              title="DNI Frente"
              subtitle="Parte frontal de tu documento"
              image={Images.documentsImages.dniFront}
              onPress={() => handleDocumentPress('dniFront')}
              isUploaded={uploadedDocuments.dniFront}
            />
            
            <DocumentCard
              title="DNI Dorso"
              subtitle="Parte trasera de tu documento"
              image={Images.documentsImages.dniBack}
              onPress={() => handleDocumentPress('dniBack')}
              isUploaded={uploadedDocuments.dniBack}
            />
          </View>
        </View>
      </ScrollView>

      <Button
        variant="primary"
        disabled={!allDocumentsUploaded}
        className="bg-primary"
      >
        Continuar
      </Button>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
    gap: 30,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 20,
  },
  documentsContainer: {
    gap: 20,
  },
});


export default ValidateDocumentsScreen;