import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  fetchFeedFirstPage,
  resetFeed,
  selectFeedVideos,
  selectFeedLoading,
  selectFeedError,
} from '@/store/slices/videoFeedSlice';
import type { AppDispatch } from '@/store';
import ReelsFeedList from '@/components/reels/ReelsFeedList';
import { useReelsAnalytics } from '@/hooks/useReelsAnalytics';

const ReelsScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocalSearchParams<{ startWith?: string }>();
  const videos = useSelector(selectFeedVideos);
  const loading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);
  const analytics = useReelsAnalytics();

  const startWith = useMemo(() => {
    const raw = params.startWith;
    if (!raw) return undefined;
    const parsed = Number(Array.isArray(raw) ? raw[0] : raw);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [params.startWith]);

  // Cantidad de videos vistos durante la sesión (para tracking on-close).
  const viewedCountRef = useRef(0);
  useEffect(() => {
    viewedCountRef.current = videos.length > 0 ? Math.max(viewedCountRef.current, 1) : 0;
  }, [videos.length]);

  // Carga inicial del feed. Resetea por si quedó estado de una sesión previa.
  useEffect(() => {
    dispatch(resetFeed());
    dispatch(fetchFeedFirstPage({ startWith }));
    if (startWith) analytics.trackReelsOpened(startWith);
    return () => {
      analytics.trackReelsClosed(viewedCountRef.current);
      dispatch(resetFeed());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // En Android, el botón hardware Back cierra la pantalla (no la app).
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      router.back();
      return true;
    });
    return () => sub.remove();
  }, [router]);

  const handleClose = () => router.back();

  const handleRetry = () => {
    dispatch(fetchFeedFirstPage({ startWith }));
  };

  // initialIndex: si el backend respeta startWith, el video estará en pos 0.
  // Igual buscamos por las dudas.
  const initialIndex = useMemo(() => {
    if (!startWith) return 0;
    const idx = videos.findIndex((v) => v.id === startWith);
    return idx >= 0 ? idx : 0;
  }, [startWith, videos]);

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      {loading && videos.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : error && videos.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={48} color="#fff" />
          <Text style={styles.stateText}>No pudimos cargar los videos.</Text>
          <Pressable style={styles.retryBtn} onPress={handleRetry}>
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : videos.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="videocam-off-outline" size={48} color="#fff" />
          <Text style={styles.stateText}>Aún no hay videos disponibles.</Text>
          <Pressable style={styles.retryBtn} onPress={handleClose}>
            <Text style={styles.retryText}>Cerrar</Text>
          </Pressable>
        </View>
      ) : (
        <ReelsFeedList initialIndex={initialIndex} />
      )}

      {/* Botón cerrar (X) flotante respetando safe-area */}
      <Pressable
        style={[styles.closeBtn, { top: insets.top + 12 }]}
        onPress={handleClose}
        hitSlop={10}
      >
        <Ionicons name="close" size={24} color="#fff" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  stateText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 8,
    backgroundColor: '#f86f1a',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
  },
  closeBtn: {
    position: 'absolute',
    left: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ReelsScreen;
