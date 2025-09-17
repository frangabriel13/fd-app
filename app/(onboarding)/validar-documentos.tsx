import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Button, Container, H2, Typography} from '@/components/ui';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import Images from '@/constants/Images';
import DocumentCard from '@/components/documents/DocumentCard';

const ValidateDocumentsScreen = () => {
  const [uploadedDocuments, setUploadedDocuments] = useState({
    selfie: false,
    dniFront: false,
    dniBack: false,
  });

  const handleDocumentPress = async (documentType: 'selfie' | 'dniFront' | 'dniBack') => {
    const options = ['Elegir de la galería', 'Tomar una foto', 'Cancelar'];
    const cancelButtonIndex = 2;

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
              setUploadedDocuments((prev) => ({ ...prev, [documentType]: true }));
            }
          } else if (index === 1) {
            // Tomar una foto
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              quality: 1,
            });
            if (!result.canceled) {
              console.log(`Foto tomada para ${documentType}:`, result.assets[0].uri);
              setUploadedDocuments((prev) => ({ ...prev, [documentType]: true }));
            }
          }
        },
      })),
      { cancelable: true }
    );
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
        Verificar identidad
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
// import { useState } from 'react';
// import * as ImagePicker from 'expo-image-picker';
// import { Button, Container, H2, Typography } from '@/components/ui';
// import { View, StyleSheet, ScrollView, Alert } from 'react-native';
// import Images from '@/constants/Images';
// import DocumentCard from '@/components/documents/DocumentCard';

// const ValidateDocumentsScreen = () => {
//   const [uploadedDocuments, setUploadedDocuments] = useState({
//     selfie: false,
//     dniFront: false,
//     dniBack: false,
//   });

//   const handleDocumentPress = async (documentType: 'selfie' | 'dniFront' | 'dniBack') => {
//     const options = ['Elegir de la galería', 'Tomar una foto', 'Cancelar'];
//     const cancelButtonIndex = 2;

//     Alert.alert(
//       'Seleccionar imagen',
//       'Elige una opción para subir tu documento',
//       options.map((option, index) => ({
//         text: option,
//         onPress: async () => {
//           if (index === 0) {
//             // Elegir de la galería
//             const result = await ImagePicker.launchImageLibraryAsync({
//               mediaTypes: ImagePicker.MediaTypeOptions.Images,
//               allowsEditing: true,
//               quality: 1,
//             });
//             if (!result.canceled) {
//               console.log(`Imagen seleccionada para ${documentType}:`, result.assets[0].uri);
//               setUploadedDocuments((prev) => ({ ...prev, [documentType]: true }));
//             }
//           } else if (index === 1) {
//             // Tomar una foto
//             const result = await ImagePicker.launchCameraAsync({
//               allowsEditing: true,
//               quality: 1,
//             });
//             if (!result.canceled) {
//               console.log(`Foto tomada para ${documentType}:`, result.assets[0].uri);
//               setUploadedDocuments((prev) => ({ ...prev, [documentType]: true }));
//             }
//           }
//         },
//       })),
//       { cancelable: true }
//     );
//   };

//   const allDocumentsUploaded = Object.values(uploadedDocuments).every(Boolean);

//   return (
//     <Container type="page" style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.content}>
//           <View>
//             <H2 style={styles.title}>Subir documentación</H2>
//             <Typography variant="body" style={styles.description}>
//               Para verificar tu identidad, necesitamos que subas los siguientes documentos:
//             </Typography>
//           </View>

//           <View style={styles.documentsContainer}>
//             <DocumentCard
//               title="Selfie con documento"
//               subtitle="Foto tuya sosteniendo tu DNI"
//               image={Images.documentsImages.selfie}
//               onPress={() => handleDocumentPress('selfie')}
//               isUploaded={uploadedDocuments.selfie}
//             />
            
//             <DocumentCard
//               title="DNI Frente"
//               subtitle="Parte frontal de tu documento"
//               image={Images.documentsImages.dniFront}
//               onPress={() => handleDocumentPress('dniFront')}
//               isUploaded={uploadedDocuments.dniFront}
//             />
            
//             <DocumentCard
//               title="DNI Dorso"
//               subtitle="Parte trasera de tu documento"
//               image={Images.documentsImages.dniBack}
//               onPress={() => handleDocumentPress('dniBack')}
//               isUploaded={uploadedDocuments.dniBack}
//             />
//           </View>
//         </View>
//       </ScrollView>

//       <Button
//         variant="primary"
//         disabled={!allDocumentsUploaded}
//         className="bg-primary"
//       >
//         Verificar identidad
//       </Button>
//     </Container>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'space-between',
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: 16,
//   },
//   content: {
//     flex: 1,
//     gap: 30,
//   },
//   title: {
//     textAlign: 'center',
//   },
//   description: {
//     color: '#6C757D',
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   documentsContainer: {
//     gap: 20,
//   },
// });

// export default ValidateDocumentsScreen;