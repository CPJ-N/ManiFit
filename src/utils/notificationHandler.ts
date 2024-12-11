import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';


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