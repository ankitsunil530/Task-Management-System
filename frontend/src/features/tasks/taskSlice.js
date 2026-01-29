import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  getMyTasksAPI,
  createTaskAPI,
  updateTaskAPI,
  deleteTaskAPI,
  getAllTasksAPI,
  assignTaskAPI,
} from "./taskService";

/* =======================
   THUNKS
======================= */

export const getMyTasks = createAsyncThunk(
  "tasks/getMy",
  async (_, thunkAPI) => {
    try {
      return await getMyTasksAPI();
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch tasks");
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (data, thunkAPI) => {
    try {
      return await createTaskAPI(data);
    } catch {
      return thunkAPI.rejectWithValue("Task creation failed");
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updateTaskAPI({ id, data });
    } catch {
      return thunkAPI.rejectWithValue("Task update failed");
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id, thunkAPI) => {
    try {
      return await deleteTaskAPI(id);
    } catch {
      return thunkAPI.rejectWithValue("Delete failed");
    }
  }
);

export const getAllTasks = createAsyncThunk(
  "tasks/getAll",
  async (_, thunkAPI) => {
    try {
      return await getAllTasksAPI();
    } catch {
      return thunkAPI.rejectWithValue("Failed to load tasks");
    }
  }
);

export const assignTask = createAsyncThunk(
  "tasks/assign",
  async ({ taskId, userId }, thunkAPI) => {
    try {
      return await assignTaskAPI({ taskId, userId });
    } catch {
      return thunkAPI.rejectWithValue("Assign failed");
    }
  }
);

/* =======================
   SLICE
======================= */

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    list: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    // For Socket.IO updates (optional but recommended)
    socketTaskCreated: (state, action) => {
      state.list.unshift(action.payload);
    },
    socketTaskUpdated: (state, action) => {
      const index = state.list.findIndex(
        (t) => t._id === action.payload._id
      );
      if (index !== -1) state.list[index] = action.payload;
    },
    socketTaskDeleted: (state, action) => {
      state.list = state.list.filter((t) => t._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder

      /* ===== GET MY TASKS ===== */
      .addCase(getMyTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(getMyTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* ===== CREATE TASK ===== */
      .addCase(createTask.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        toast.success("Task created ✅");
      })

      /* ===== UPDATE TASK ===== */
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) state.list[index] = action.payload;
        toast.info("Task updated 🔄");
      })

      /* ===== DELETE TASK ===== */
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (t) => t._id !== action.payload
        );
        toast.info("Task deleted 🗑️");
      })

      /* ===== ADMIN: GET ALL ===== */
      .addCase(getAllTasks.fulfilled, (state, action) => {
        state.list = action.payload;
      })

      /* ===== ADMIN: ASSIGN ===== */
      .addCase(assignTask.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) state.list[index] = action.payload;
        toast.success("Task assigned successfully ✅");
      });
  },
});

/* =======================
   EXPORTS
======================= */

export const {
  socketTaskCreated,
  socketTaskUpdated,
  socketTaskDeleted,
} = taskSlice.actions;

export default taskSlice.reducer;
