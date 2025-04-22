import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backend_url=import.meta.env.VITE_BACKEND_URI||'http://localhost:8000';
export const loginUser = createAsyncThunk(
  'user/login',
  async ({ user_id, password}, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backend_url}/api/user/login`, { user_id, password }, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const registerUser = createAsyncThunk(
  'user/register',
  async ({name,user_id,email, password}, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/user/register', {
        name,
        user_id,
        email,
        password
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/user/logout', {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const updateUser = createAsyncThunk(
  'user/update',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/auth/user/update/${id}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const getUser = createAsyncThunk(
  'user/get',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/auth/user/get/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const getAllUsers = createAsyncThunk(
  'user/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/auth/user/all');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const deleteUser = createAsyncThunk(
  'user/delete',
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/auth/delete/${user_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const initialState = {
  user: null,
  users: [],
  loading: false,
  success: false,
  error: null,
};


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.data?.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.success = false;
      })

      
      .addCase(updateUser.fulfilled, (state, action) => {
        state.success = true;
      })

      
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })

      
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(
          (u) => u.user_id !== action.meta.arg
        );
      });
  },
});

export default userSlice.reducer;
