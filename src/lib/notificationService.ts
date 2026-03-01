import Constants from 'expo-constants';
import { Platform } from 'react-native';

const isExpoGo = Constants.appOwnership === 'expo';

let Notifications: typeof import('expo-notifications') | null = null;

async function getNotifications() {
  if (!Notifications) {
    Notifications = await import('expo-notifications');
  }
  return Notifications;
}

// Set up notification handler (only outside Expo Go)
if (!isExpoGo) {
  getNotifications().then((N) => {
    N.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  return ensurePermissionsAndChannel();
}

async function ensurePermissionsAndChannel(): Promise<boolean> {
  if (isExpoGo) return false;

  const N = await getNotifications();

  if (Platform.OS === 'android') {
    await N.setNotificationChannelAsync('default', {
      name: 'Two-Do',
      importance: N.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status: existingStatus } = await N.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await N.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (isExpoGo) return null;

  const granted = await ensurePermissionsAndChannel();
  if (!granted) return null;

  const N = await getNotifications();
  const token = await N.getExpoPushTokenAsync();
  return token.data;
}

export async function scheduleDueReminder(questTitle: string, dueDate: Date, questId: string): Promise<string | null> {
  if (isExpoGo) return null;

  const now = new Date();
  const oneHourBefore = new Date(dueDate.getTime() - 60 * 60 * 1000);
  if (oneHourBefore <= now) return null;

  const N = await getNotifications();
  const id = await N.scheduleNotificationAsync({
    content: {
      title: 'Quest Due Soon!',
      body: `"${questTitle}" is due in 1 hour`,
      data: { questId },
    },
    trigger: {
      type: N.SchedulableTriggerInputTypes.DATE,
      date: oneHourBefore,
    },
  });

  return id;
}

export async function cancelNotification(notificationId: string): Promise<void> {
  if (isExpoGo) return;
  const N = await getNotifications();
  await N.cancelScheduledNotificationAsync(notificationId);
}

export async function sendLocalNotification(title: string, body: string): Promise<void> {
  if (isExpoGo) return;
  await ensurePermissionsAndChannel();
  const N = await getNotifications();
  await N.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });
}
