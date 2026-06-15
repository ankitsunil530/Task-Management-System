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
======================= */

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
======================= */

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
export default notificationSlice.reducer;
