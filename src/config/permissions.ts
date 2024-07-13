// permissions.ts
import * as ImagePicker from 'expo-image-picker';

export const requestMediaLibraryPermissions = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access media library is required!');
    return false;
  }
  return true;
};