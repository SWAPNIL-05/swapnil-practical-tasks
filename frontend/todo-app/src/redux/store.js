import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/authSlice';
import {boardReducer } from './slices/boardSlice';
import { tasksReducer } from './slices/taksSlice';

export const store = configureStore({
  reducer: {
    auth:authReducer,
    board:boardReducer,
    tasks:tasksReducer,
  },
});