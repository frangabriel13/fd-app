import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { Typography } from '@/components/ui';

interface DocumentCardProps {
  title: string;
  subtitle?: string;
  image: ImageSourcePropType;
  onPress: () => void;
  isUploaded?: boolean;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  title,
  subtitle,
  image,
  onPress,
  isUploaded = false,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, isUploaded && styles.containerUploaded]} 
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Typography variant="h3" style={styles.title}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body" style={styles.subtitle}>
              {subtitle}
            </Typography>
          )}
        </View>
        
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image} resizeMode="contain" />
          {isUploaded && (
            <View style={styles.uploadedIndicator}>
              <Typography variant="caption" style={styles.uploadedText}>
                ✓ Subido
              </Typography>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  containerUploaded: {
    borderColor: '#28A745',
    backgroundColor: '#F8FFF9',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6C757D',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
  },
  uploadedIndicator: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#28A745',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  uploadedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default DocumentCard;
