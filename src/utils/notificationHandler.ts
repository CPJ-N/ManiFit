import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Schedule a test notification
export const scheduleTestNotification = async (title: string, body: string, delayInSeconds: number) => {
  const trigger = new Date(Date.now() + delayInSeconds * 1000); // Schedule for a few seconds from now

  console.log(`Scheduling test notification with title: ${title}, body: ${body}, delay: ${delayInSeconds} seconds`);

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: trigger,
    },
  });

  console.log('Test notification scheduled successfully');

  let counter = delayInSeconds;
  const intervalId = setInterval(() => {
    if (counter > 0) {
      console.log(`Notification will pop in ${counter} seconds`);
      counter--;
    } else {
      console.log('Notification should pop now');
      clearInterval(intervalId);
    }
  }, 1000);
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
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: trigger,
    },
  });
};

// Request notification permissions
export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access notifications was denied');
  }
};

// Configure notification settings
export const configureNotifications = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
};

// Handle notification response
Notifications.addNotificationResponseReceivedListener(response => {
  console.log(response);
});
