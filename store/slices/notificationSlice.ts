import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationInstance } from '@/services/axiosConfig';

export interface AppNotification {
  id: number;
  type: 'new_product' | 'live_started' | 'new_sale';
  title: string;
  body: string;
  data: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  currentPage: number;
  totalPages: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  currentPage: 1,
  totalPages: 1,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async ({ page = 1, pageSize = 20 }: { page?: number; pageSize?: number }, { rejectWithValue }) => {
    try {
      const res = await notificationInstance.get(`/?page=${page}&pageSize=${pageSize}`);
      return { ...res.data, page };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener notificaciones');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/unreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const res = await notificationInstance.get('/unread-count');
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: number, { rejectWithValue }) => {
    try {
      await notificationInstance.put(`/${id}/read`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationInstance.put('/read-all');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotifications(state) {
      state.notifications = [];
      state.unreadCount = 0;
      state.currentPage = 1;
      state.totalPages = 1;
    },
    incrementUnread(state) {
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.loading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const { notifications, totalPages, page } = action.payload;
        if (page === 1) {
          state.notifications = notifications;
        } else {
          const existingIds = new Set(state.notifications.map((n: AppNotification) => n.id));
          const newOnes = notifications.filter((n: AppNotification) => !existingIds.has(n.id));
          state.notifications = [...state.notifications, ...newOnes];
        }
        state.currentPage = page;
        state.totalPages = totalPages ?? 1;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state) => { state.loading = false; })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notif = state.notifications.find(n => n.id === action.payload);
        if (notif && !notif.isRead) {
          notif.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => { n.isRead = true; });
        state.unreadCount = 0;
      });
  },
});

export const { clearNotifications, incrementUnread } = notificationSlice.actions;
export default notificationSlice.reducer;
