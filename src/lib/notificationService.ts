import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function ensurePermissionsAndChannel(): Promise<boolean> {
  // Set up Android notification channel (needed for all notifications)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Two-Do',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

export async function registerForPushNotifications(): Promise<string | null> {
  const granted = await ensurePermissionsAndChannel();
  if (!granted) return null;

  // Push tokens only work on real devices
  if (!Device.isDevice) return null;

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
}

export async function scheduleDueReminder(questTitle: string, dueDate: Date, questId: string): Promise<string | null> {
  const now = new Date();
  const oneHourBefore = new Date(dueDate.getTime() - 60 * 60 * 1000);

  if (oneHourBefore <= now) return null;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Quest Due Soon!',
      body: `"${questTitle}" is due in 1 hour`,
      data: { questId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: oneHourBefore,
    },
  });

  return id;
}

export async function cancelNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function sendLocalNotification(title: string, body: string): Promise<void> {
  await ensurePermissionsAndChannel();
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });
}
