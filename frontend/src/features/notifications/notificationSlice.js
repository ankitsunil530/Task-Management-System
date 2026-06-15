import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  getNotificationsAPI,
  markAsReadAPI,
  markAllAsReadAPI,
  deleteNotificationAPI,
} from "./notificationService";

const extractData = (res) => res?.data || res;

/* =======================
   THUNKS

export const getNotifications = createAsyncThunk(
  "notifications/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await getNotificationsAPI();
      return extractData(res);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load notifications"
      );
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markRead",
  async (id, thunkAPI) => {
    try {
      const res = await markAsReadAPI(id);
      return extractData(res);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark notification as read"
      );
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, thunkAPI) => {
    try {
      await markAllAsReadAPI();
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark all as read"
      );
    }
  }
);

export const dismissNotification = createAsyncThunk(
  "notifications/dismiss",
  async (id, thunkAPI) => {
    try {
      await deleteNotificationAPI(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to dismiss notification"
      );
    }
  }
);

/* =======================
   SLICE
import api from "../../api/axios";

/* ================= THUNKS ================= */

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/notifications");
      return res.data; // { unreadCount, count, data }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to load notifications"
      );
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (id, thunkAPI) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to mark read"
      );
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, thunkAPI) => {
    try {
      await api.patch("/notifications/read-all");
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to mark all read"
      );
    }
  }
);

/* ================= SLICE ================= */

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    socketNotificationReceived: (state, action) => {
      // Avoid duplicate notifications in state
      const exists = state.list.some((n) => n._id === action.payload._id);
      if (!exists) {
        state.list.unshift(action.payload);
        // Toast incoming real-time notifications
        toast.info(action.payload.message, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    items: [],
    unreadCount: 0,
    isLoading: false,
  },
  reducers: {
    // Called when a notification arrives over the socket in real time.
    notificationReceived: (state, action) => {
      const incoming = action.payload;
      if (!incoming || state.items.some((n) => n._id === incoming._id)) return;
      state.items.unshift(incoming);
      if (!incoming.read) state.unreadCount += 1;
    },
    // Clear on logout.
    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ===== GET ALL ===== */
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* ===== MARK SINGLE READ ===== */
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.list.findIndex((n) => n._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      /* ===== MARK ALL READ ===== */
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.list = state.list.map((n) => ({ ...n, isRead: true }));
      })

      /* ===== DISMISS / DELETE ===== */
      .addCase(dismissNotification.fulfilled, (state, action) => {
        state.list = state.list.filter((n) => n._id !== action.payload);
      });
  },
});

export const { socketNotificationReceived } = notificationSlice.actions;
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data || [];
        state.unreadCount = action.payload.unreadCount || 0;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const n = state.items.find((x) => x._id === action.payload);
        if (n && !n.read) {
          n.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items.forEach((n) => {
          n.read = true;
        });
        state.unreadCount = 0;
      });
  },
});

export const { notificationReceived, clearNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
