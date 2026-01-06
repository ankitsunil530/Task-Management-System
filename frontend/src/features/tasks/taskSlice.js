import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
    getMyTasksAPI,
    createTaskAPI,
    updateTaskStatusAPI,
    deleteTaskAPI,
    getAllTasksAPI,
    assignTaskAPI,
} from "./taskService";

export const getMyTasks = createAsyncThunk(
    "tasks/getMy",
    async (_, thunkAPI) => {
        try {
            return await getMyTasksAPI();
        } catch (e) {
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

export const updateTaskStatus = createAsyncThunk(
    "tasks/updateStatus",
    async ({ id, status }, thunkAPI) => {
        try {
            return await updateTaskStatusAPI({ id, status });
        } catch {
            return thunkAPI.rejectWithValue("Status update failed");
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

const taskSlice = createSlice({
    name: "tasks",
    initialState: {
        list: [],
        isLoading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMyTasks.pending, (s) => { s.isLoading = true; })
            .addCase(getMyTasks.fulfilled, (s, a) => {
                s.isLoading = false;
                s.list = a.payload;
            })

            .addCase(createTask.fulfilled, (s, a) => {
                s.list.unshift(a.payload);
                toast.success("Task created ✅");
            })

            .addCase(updateTaskStatus.fulfilled, (s, a) => {
                const i = s.list.findIndex(t => t._id === a.payload._id);
                if (i !== -1) s.list[i] = a.payload;
                toast.info("Status updated 🔄");
            })

            .addCase(deleteTask.fulfilled, (s, a) => {
                s.list = s.list.filter(t => t._id !== a.payload);
                toast.info("Task deleted 🗑️");
            })
            .addCase(getAllTasks.fulfilled, (state, action) => {
                state.list = action.payload;
            })
            .addCase(assignTask.fulfilled, (state, action) => {
                const index = state.list.findIndex(t => t._id === action.payload._id);
                if (index !== -1) state.list[index] = action.payload;
                toast.success("Task assigned successfully");
            });

    },
});

export default taskSlice.reducer;
