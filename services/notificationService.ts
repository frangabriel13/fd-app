import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';
import { notificationInstance } from './axiosConfig';

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) return false;
  }

  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

export async function registerDeviceToken(): Promise<string | null> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.warn('⚠️ Permisos de notificación denegados');
      return null;
    }

    const token = await messaging().getToken();
    await notificationInstance.post('/device-token', {
      token,
      platform: Platform.OS,
    });

    console.log('🔔 FCM Token registrado');
    return token;
  } catch (error) {
    console.error('❌ Error registrando device token:', error);
    return null;
  }
}

export async function removeDeviceToken(): Promise<void> {
  try {
    const token = await messaging().getToken();
    await notificationInstance.delete('/device-token', {
      data: { token },
    });
  } catch (error) {
    console.error('❌ Error eliminando device token:', error);
  }
}

export function onTokenRefresh(callback: (token: string) => void) {
  return messaging().onTokenRefresh(callback);
}
