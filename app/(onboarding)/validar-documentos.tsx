import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Button, Container, H2, Typography} from '@/components/ui';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import Images from '@/constants/Images';
import DocumentCard from '@/components/documents/DocumentCard';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { uploadDocuments, clearError } from '@/store/slices/manufacturerSlice';

const ValidateDocumentsScreen = () => {
  const dispatch = useAppDispatch();
  const { loading, success, error } = useAppSelector((state) => state.manufacturer);
  const manufacturerId = Number(useAppSelector((state) => state.user.user?.manufacturer?.id));
  const manufacturer = useAppSelector((state) => state.user.user?.manufacturer);
  // console.log('myUser', myUser);
  console.log('manufacturerId', manufacturerId);
  
  const [selectedDocuments, setSelectedDocuments] = useState<{
    selfie: string | null;
    dniFront: string | null;
    dniBack: string | null;
  }>({
    selfie: null,
    dniFront: null,
    dniBack: null,
  });

  const [uploadedDocuments, setUploadedDocuments] = useState({
    selfie: false,
    dniFront: false,
    dniBack: false,
  });

  const [hasJustUploaded, setHasJustUploaded] = useState(false);

  // Effect para inicializar documentos existentes
  useEffect(() => {
    if (manufacturer) {
      setSelectedDocuments({
        selfie: manufacturer.selfie || null,
        dniFront: manufacturer.dniFront || null,
        dniBack: manufacturer.dniBack || null,
      });

      setUploadedDocuments({
        selfie: !!manufacturer.selfie,
        dniFront: !!manufacturer.dniFront,
        dniBack: !!manufacturer.dniBack,
      });
    }
  }, [manufacturer]);

  // Effect para limpiar el estado de Redux al montar el componente
  useEffect(() => {
    dispatch(clearError());
    // También podríamos resetear el state completo si hay una acción para eso
  }, [dispatch]);

  // Effect para manejar el éxito de la subida
  useEffect(() => {
    if (success && hasJustUploaded) {
      setUploadedDocuments({
        selfie: true,
        dniFront: true,
        dniBack: true,
      });
      Alert.alert('¡Éxito!', 'Los documentos se han subido correctamente');
      setHasJustUploaded(false); // Reset del flag
    }
  }, [success, hasJustUploaded]);

  // Effect para manejar errores
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleDocumentPress = async (documentType: 'selfie' | 'dniFront' | 'dniBack') => {
    const options = ['Elegir de la galería', 'Tomar una foto', 'Cancelar'];

    Alert.alert(
      'Seleccionar imagen',
      'Elige una opción para subir tu documento',
      options.map((option, index) => ({
        text: option,
        onPress: async () => {
          if (index === 0) {
            // Elegir de la galería
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              quality: 1,
            });
            if (!result.canceled) {
              console.log(`Imagen seleccionada para ${documentType}:`, result.assets[0].uri);
              setSelectedDocuments((prev) => ({ ...prev, [documentType]: result.assets[0].uri }));
            }
          } else if (index === 1) {
            // Tomar una foto
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              quality: 1,
            });
            if (!result.canceled) {
              console.log(`Foto tomada para ${documentType}:`, result.assets[0].uri);
              setSelectedDocuments((prev) => ({ ...prev, [documentType]: result.assets[0].uri }));
            }
          }
        },
      })),
      { cancelable: true }
    );
  };

  const handleVerifyIdentity = async () => {
    if (!allDocumentsSelected) {
      Alert.alert('Error', 'Por favor selecciona todas las imágenes antes de continuar.');
      return;
    }

    try {
      // Marcar que estamos iniciando una subida
      setHasJustUploaded(true);
      
      // Preparar las imágenes para la subida
      const images = {
        selfie: {
          uri: selectedDocuments.selfie!,
          type: 'image/jpeg',
          name: 'selfie.jpg',
        },
        dniFront: {
          uri: selectedDocuments.dniFront!,
          type: 'image/jpeg',
          name: 'dni_front.jpg',
        },
        dniBack: {
          uri: selectedDocuments.dniBack!,
          type: 'image/jpeg',
          name: 'dni_back.jpg',
        },
      };

      // Necesitarás obtener el ID del fabricante de algún lugar
      // Por ahora uso un ID temporal - deberás cambiarlo según tu lógica
      console.log('manufacturerId:', manufacturerId);
      
      await dispatch(uploadDocuments({ id: manufacturerId, images })).unwrap();
    } catch (error) {
      console.error('Error al subir documentos:', error);
    }
  };

  const allDocumentsSelected = Object.values(selectedDocuments).every(Boolean);
  const allDocumentsUploaded = Object.values(uploadedDocuments).every(Boolean);

  return (
    <Container type="page" style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View>
            <H2 style={styles.title}>Subir documentación</H2>
            <Typography variant="body" style={styles.description}>
              {allDocumentsUploaded 
                ? "Tus documentos han sido enviados y están pendientes de verificación."
                : "Para verificar tu identidad, necesitamos que subas los siguientes documentos:"
              }
            </Typography>
          </View>

          <View style={styles.documentsContainer}>
            <DocumentCard
              title="Selfie con documento"
              subtitle="Foto tuya sosteniendo tu DNI"
              image={selectedDocuments.selfie ? { uri: selectedDocuments.selfie } : Images.documentsImages.selfie}
              onPress={uploadedDocuments.selfie ? () => {} : () => handleDocumentPress('selfie')}
              isUploaded={uploadedDocuments.selfie}
              isSelected={!!selectedDocuments.selfie}
            />
            
            <DocumentCard
              title="DNI Frente"
              subtitle="Parte frontal de tu documento"
              image={selectedDocuments.dniFront ? { uri: selectedDocuments.dniFront } : Images.documentsImages.dniFront}
              onPress={uploadedDocuments.dniFront ? () => {} : () => handleDocumentPress('dniFront')}
              isUploaded={uploadedDocuments.dniFront}
              isSelected={!!selectedDocuments.dniFront}
            />
            
            <DocumentCard
              title="DNI Dorso"
              subtitle="Parte trasera de tu documento"
              image={selectedDocuments.dniBack ? { uri: selectedDocuments.dniBack } : Images.documentsImages.dniBack}
              onPress={uploadedDocuments.dniBack ? () => {} : () => handleDocumentPress('dniBack')}
              isUploaded={uploadedDocuments.dniBack}
              isSelected={!!selectedDocuments.dniBack}
            />
          </View>
        </View>
      </ScrollView>

      {/* {allDocumentsUploaded && (
        <View style={styles.pendingMessage}>
          <Typography variant="body" style={styles.pendingText}>
            📋 Tus documentos están pendientes de verificación
          </Typography>
        </View>
      )} */}
      
      <Button
        variant="primary"
        disabled={!allDocumentsSelected || loading || allDocumentsUploaded}
        className="bg-primary"
        onPress={handleVerifyIdentity}
      >
        {loading ? 'Subiendo documentos...' : 'Verificar identidad'}
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
  // pendingMessage: {
  //   backgroundColor: '#E3F2FD',
  //   padding: 16,
  //   borderRadius: 8,
  //   marginBottom: 16,
  // },
  // pendingText: {
  //   color: '#1976D2',
  //   textAlign: 'center',
  //   fontWeight: '500',
  // },
});


export default ValidateDocumentsScreen;