import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useUploadImage } from '../utils/useUploadImage';

export const ImageUploadScreen = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const handleImageUpload = async () => {
    setIsUploading(true);
    await useUploadImage(); // Assuming this function does all handling internally
    setIsUploading(false);
    setUploadSuccess(true); // Assuming the upload is always successful
  };

  return (
    <View style={styles.container}>
      {isUploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Upload Image" onPress={handleImageUpload} />
      )}
      {uploadSuccess && <Text>Image uploaded successfully!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  }
});