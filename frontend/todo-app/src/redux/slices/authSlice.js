
import { createSlice ,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';  
const backendUrl = 'http://localhost:5000/auth';
export const login = createAsyncThunk(
  'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
       const response =await axios.post(`${backendUrl}/login`, {
            email,
            password
        });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            return { user, token };
    } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue({ error: error.response.data.error });
            } else {
                return rejectWithValue({ error: 'Network error' });
            }
        }
      
    }
);

export const register = createAsyncThunk(
  'auth/register',  
    async ({ username, email, password }, { rejectWithValue }) => {
        try {
        const response = await axios.post(`${backendUrl}/register`, {
            username,
            email,
            password
        });
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        return { user, token };
        } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue({ error: error.response.data.error });
        } else {
            return rejectWithValue({ error: 'Network error' });
        }
        }
    });


const authSlice =createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token:localStorage.getItem('token') || null,
    loading: false,
    error: null
  },
  reducers: {
 
  
   logout: (state) => {
      state.user = null;
      state.loading = false;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error || 'Registration failed';
      });
  }
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;