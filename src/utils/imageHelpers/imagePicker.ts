// useImagePicker.ts
import * as ImagePicker from 'expo-image-picker';
import { requestMediaLibraryPermissions } from '../../config/permissions';

export const pickImage = async (): Promise<string | null> => {
  const hasPermission = await requestMediaLibraryPermissions();
  if (!hasPermission) return null;

  let result: ImagePicker.ImagePickerResult | ImagePicker.ImagePickerSuccessResult = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  console.log('image picker:', result);

  return result.canceled ? null : result.assets[0].uri;
};