import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import taskReducer from "../features/tasks/taskSlice";
import notificationReducer from "../features/notifications/notificationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    notifications: notificationReducer,
  },
});
export default store;