import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { loginAPI, registerAPI } from "./authService";

const user = JSON.parse(localStorage.getItem("user"));

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
