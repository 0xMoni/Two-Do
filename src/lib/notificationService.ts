import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isExpoGo = Constants.appOwnership === 'expo';
const NOTIF_MAP_KEY = '@quest_notification_ids';

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

async function getNotifMap(): Promise<Record<string, string>> {
  try {
    const raw = await AsyncStorage.getItem(NOTIF_MAP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function saveNotifMap(map: Record<string, string>): Promise<void> {
  await AsyncStorage.setItem(NOTIF_MAP_KEY, JSON.stringify(map));
}

export async function scheduleOrUpdateDueReminder(
  questTitle: string,
  dueDate: Date,
  questId: string,
): Promise<void> {
  const map = await getNotifMap();

  // Cancel existing notification for this quest
  if (map[questId]) {
    await cancelNotification(map[questId]).catch(() => {});
    delete map[questId];
  }

  const notifId = await scheduleDueReminder(questTitle, dueDate, questId);
  if (notifId) {
    map[questId] = notifId;
  }
  await saveNotifMap(map);
}

export async function scheduleRemindersForQuests(
  quests: { id: string; title: string; dueDate: Date }[],
): Promise<void> {
  for (const q of quests) {
    await scheduleOrUpdateDueReminder(q.title, q.dueDate, q.id).catch(() => {});
  }
}
