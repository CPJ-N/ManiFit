import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';

export const requestMediaLibraryPermissions = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access media library is required!');
    return false;
  }
  return true;
};

// Request permissions for notifications
export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  // if (status !== 'granted') {
  //   alert('You need to enable notifications in settings');
  // }
};