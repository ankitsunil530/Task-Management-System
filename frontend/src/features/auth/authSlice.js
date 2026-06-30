import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { loginAPI, registerAPI } from "./authService";
import { socket } from "../../socket";
import { clearNotifications } from "../notifications/notificationSlice";

// Decode a JWT's `exp` claim (standard base64url JSON — no library needed) and
// check it against the current time. Returns false for a missing, malformed, or
// expired token so a stale 7-day-old session never re-hydrates as "logged in".
const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const storedToken = localStorage.getItem("token");
// If the stored token is invalid/expired, clear the session before the Redux
// store initialises so the user never briefly appears logged in on boot.
if (!isTokenValid(storedToken)) {
  localStorage.clear();
}
const user = isTokenValid(storedToken)
  ? JSON.parse(localStorage.getItem("user"))
  : null;

export const login = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      return await loginAPI(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);
export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      return await registerAPI(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: user || null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.clear();
      toast.info("Logged out successfully 👋");
    },
    resetAuthState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    setProfilePicture: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, profilePicture: action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔄 LOGIN PENDING
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })

      // ✅ LOGIN SUCCESS
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;

        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("token", action.payload.token);

        // Connect socket and join user's room
        socket.connect();
        socket.emit("join", action.payload._id);

        toast.success("Logged in successfully 🎉");
      })

      // ❌ LOGIN FAILED
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;

        toast.error(action.payload || "Login failed");
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;

        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("token", action.payload.token);

        // Connect socket and join user's room
        socket.connect();
        socket.emit("join", action.payload._id);

        toast.success("Account created successfully 🎉");
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;

        toast.error(action.payload);
      });
  },
});

export const { logout, resetAuthState, setProfilePicture } = authSlice.actions;
export default authSlice.reducer;
