import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Course } from '@/types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  }

  async scheduleCADeadlineNotification(
    course: Course,
    deadline: Date,
    notificationId?: string
  ): Promise<string> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Notification permissions not granted');
    }

    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }

    const oneDayBefore = new Date(deadline);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);

    const now = new Date();
    if (oneDayBefore <= now) {
      throw new Error('Deadline is too soon to schedule notification');
    }

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'CA Deadline Reminder',
        body: `${course.code}: ${course.title} - CA deadline tomorrow!`,
        data: { courseId: course.id, type: 'ca_deadline' },
      },
      trigger: {
        date: oneDayBefore,
      },
    });

    return identifier;
  }

  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async getScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  async sendImmediateNotification(title: string, body: string, data?: any): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null,
    });
  }
}

export const notificationService = new NotificationService();
