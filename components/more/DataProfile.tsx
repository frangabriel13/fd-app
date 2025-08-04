import AntDesign from '@expo/vector-icons/AntDesign';
import { BodyText, Card, H3 } from '../ui';

const DataProfile = () => {
  return (
    <Card variant="default" className='bg-secondary'>
      <H3 className='text-white'>Franco Mansilla</H3>
      <BodyText className='text-white'>
        Mi perfil <AntDesign name="right" size={24} color="white" />
      </BodyText>
    </Card>
  );
};

export default DataProfile;