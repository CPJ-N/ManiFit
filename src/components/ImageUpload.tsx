import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useUploadImage } from '../utils/imageHelpers/useUploadImage';
import { getImageUrl } from '../utils/controllers/imageController';
import { firebaseBucketName } from '../constants/firebaseContant';

export const ImageUploadScreen = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const handleImageUpload = async () => {
    setIsUploading(true);
    await useUploadImage().then(async (result) =>{
      if (result) {
        // Do something with the result
        const imageUrl = await getImageUrl(firebaseBucketName.userImages, result.metadata.name);
        console.log('Image uploaded:', imageUrl);
      }
    }); // Assuming this function does all handling internally
    
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