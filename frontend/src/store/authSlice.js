import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = '/api';

export const login = createAsyncThunk('auth/login', async ({ email, password, role }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password, role });
    localStorage.setItem('token', response.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const register = createAsyncThunk('auth/register', async ({ name, email, password, role }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
    toast.success('Registration successful! Please login.');
    return response.data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Registration failed');
    return rejectWithValue(err.response?.data);
  }
});

export const initializeAuth = createAsyncThunk('auth/initialize', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  if (!token) return rejectWithValue('No token');

  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
  } catch (err) {
    localStorage.removeItem('token');
    return rejectWithValue('Invalid token');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    },
    showMessage: (state, action) => {
      state.message = action.payload;
    },
    hideMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = { title: 'Success', message: 'Login successful', type: 'success' };
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = { title: 'Error', message: action.payload?.message || 'Login failed', type: 'error' };
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
