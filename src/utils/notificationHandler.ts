// src/utils/notificationHandler.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Request permissions for notifications
export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  // if (status !== 'granted') {
  //   alert('You need to enable notifications in settings');
  // }
};

// Schedule a monthly notification
export const scheduleMonthlyNotification = async (title: string, body: string, dueDate: Date) => {
  const trigger = new Date(dueDate);
  trigger.setMonth(trigger.getMonth() + 1); // Schedule for next month

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: {
      date: trigger,
      repeats: true,
    },
  });
};

// Configure notification settings
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Handle notification response
Notifications.addNotificationResponseReceivedListener(response => {
  console.log(response);
});