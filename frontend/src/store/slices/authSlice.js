import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8000/backend/api/auth/login/', loginData);
      return response.data;  // Nehmen wir an, das Backend gibt ein Token zurück
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,  // Token aus dem localStorage laden
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem('token');  // Token beim Logout aus dem localStorage entfernen
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);  // Token im localStorage speichern
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
