import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const backendUrl = "http://localhost:5000/board";

export const fetchBoards = createAsyncThunk(
  "board/fetchBoards",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;
    try {
      const response = await axios.get(`${backendUrl}/getAllBoards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue({ error: error.response.data.error });
      } else {
        return rejectWithValue({ error: "Network error" });
      }
    }
  }
);

export const createBoard = createAsyncThunk(
  "board/createBoard",
  async ({ title }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;
    try {
      const response = await axios.post(
        ` ${backendUrl}/create`,
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data, "Board created successfully");
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue({ error: error.response.data.error });
      } else {
        return rejectWithValue({ error: "Network error" });
      }
    }
  }
);

export const deleteBoard = createAsyncThunk(
  "board/deleteBoard",
  async (boardId, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;
    try {
      await axios.delete(`${backendUrl}/delete/${boardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return boardId;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue({ error: error.response.data.error });
      } else {
        return rejectWithValue({ error: "Network error" });
      }
    }
  }
);

export const updateBoard = createAsyncThunk(
  "board/updateBoard",
  async ({ boardId, title }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;
    try {
      const response = await axios.put(
        `${backendUrl}/update/${boardId}`,
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue({ error: error.response.data.error });
      } else {
        return rejectWithValue({ error: "Network error" });
      }
    }
  }
);
const boardSlice = createSlice({
  name: "board",
  initialState: {
    boards: [],
    selectedBoard: null,
    columns: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedBoard(state, action) {
      state.selectedBoard = action.payload;
    },
    setColumns(state, action) {
      state.columns = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = action.payload;
        // if (action.payload.length > 0) {
        //   state.selectedBoard = action.payload[0];
        // }
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error || "Failed to fetch boards";
      })
      .addCase(createBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
        
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.boards.push(action.payload.board);
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error || "Failed to create board";
      })
      .addCase(deleteBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = state.boards.filter(
          (board) => board._id !== action.payload
        );
        if (state.selectedBoard?._id === action.payload) {
          state.selectedBoard = state.boards[0] || null;
        }
      })
      .addCase(deleteBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error || "Failed to delete board";
      })
      .addCase(updateBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.boards.findIndex(
          (board) => board._id === action.payload._id
        );
        if (index !== -1) {
          state.boards[index] = action.payload;
        }
      })
      .addCase(updateBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error || "Failed to update board";
      });
  },
});
export const { setSelectedBoard, setColumns } = boardSlice.actions;
export const boardReducer = boardSlice.reducer;
