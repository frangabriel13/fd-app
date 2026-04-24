import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchUnreadCount, incrementUnread } from '@/store/slices/notificationSlice';
import { registerDeviceToken, onTokenRefresh } from '@/services/notificationService';
import { notificationInstance } from '@/services/axiosConfig';

export function useNotifications() {
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token);
  const unsubscribeRefresh = useRef<(() => void) | null>(null);

  // Registrar token FCM al autenticarse
  useEffect(() => {
    if (!token) return;

    registerDeviceToken();

    unsubscribeRefresh.current = onTokenRefresh(async (newToken) => {
      try {
        await notificationInstance.post('/device-token', {
          token: newToken,
          platform: 'android',
        });
      } catch (err) {
        console.error('Error re-registrando token:', err);
      }
    });

    return () => { unsubscribeRefresh.current?.(); };
  }, [token]);

  // Polling del badge al volver a la app (AppState)
  useEffect(() => {
    if (!token) return;

    dispatch(fetchUnreadCount());

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        dispatch(fetchUnreadCount());
      }
    });

    return () => subscription.remove();
  }, [token, dispatch]);

  // Notificación recibida con app en foreground
  useEffect(() => {
    if (!token) return;

    const unsubscribe = messaging().onMessage(async () => {
      dispatch(incrementUnread());
    });

    return unsubscribe;
  }, [token, dispatch]);

  // Tap en notificación con app en background
  useEffect(() => {
    if (!token) return;

    const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      handleNotificationNavigation(remoteMessage.data as Record<string, string>);
    });

    // App estaba cerrada y el usuario tocó la notificación
    messaging().getInitialNotification().then((remoteMessage) => {
      if (remoteMessage) {
        setTimeout(() => {
          handleNotificationNavigation(remoteMessage.data as Record<string, string>);
        }, 1000);
      }
    });

    return unsubscribe;
  }, [token]);
}

function handleNotificationNavigation(data?: Record<string, string>) {
  if (!data?.type) return;

  if (data.type === 'new_product' && data.productId) {
    router.push(`/(tabs)/producto/${data.productId}` as any);
  } else if (data.type === 'live_started' && data.manufacturerId) {
    router.push(`/(tabs)/store/${data.manufacturerId}` as any);
  } else if (data.type === 'new_sale' && data.subOrderId) {
    router.push({ pathname: '/(dashboard)/ver-ordenes/ver-orden' as any, params: { subOrderId: data.subOrderId } });
  }
}
