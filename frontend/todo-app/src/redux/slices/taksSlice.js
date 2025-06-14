import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendUrl = "http://localhost:5000/tasks";
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (boardId, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;
    try {
      const response = await axios.get(`${backendUrl}/${boardId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
        return response.data;
    
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;
    try {
      const response = await axios.post(`${backendUrl}/create`, 
       taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, ...taskData }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;
    try {
      const response = await axios.put(`${backendUrl}/update/${taskId}`, 
       taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;
    try {
      await axios.delete(`${backendUrl}/delete/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return taskId; 
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    loading: false,
    error: null
  },
 reducers: {},
 extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  }
});
export const { actions} = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;