import { View, Text, StyleSheet } from 'react-native';
import { Button, Container, H1 } from '@/components/ui';
import { Typography } from '@/components/ui/Typography';


interface SuccessModalProps {
  title: string;
  text: string;
}

const SuccessModal = ({ title, text }: SuccessModalProps) => {
  return (
    <Container className="justify-center bg-primary">
      <H1 className="text-center mb-4 text-white">{title}</H1>

      <Typography variant="body" className="text-gray-300 mb-4 text-center">
        {text}
      </Typography>
    </Container>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     padding: 0,
//   },
// });


export default SuccessModal;