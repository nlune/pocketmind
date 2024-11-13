import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action to fetch user settings from backend
export const fetchUserSettings = createAsyncThunk(
  'settings/fetchUserSettings',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;  // Get token from auth slice

      const response = await axios.get('http://localhost:8000/backend/api/home/user/settings/', {
        headers: {
          Authorization: `Bearer ${token}`,  // Pass token in headers
        },
      });
      console.log('Fetched settings:', response.data); // Logge die empfangenen Daten
      return response.data;
    } catch (error) {
      console.error('Error fetching user settings:', error); // Logge den Fehler
      return rejectWithValue(error.response.data);
    }
  }
);

// Async action to update user settings
export const updateUserSettings = createAsyncThunk(
  'settings/updateUserSettings',
  async (settingsData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      console.log('Current state:', state);
      const token = state.auth?.token;  // Get token from auth slice
      if (!token) {
        throw new Error("Token is missing or undefined");
      }
      const response = await axios.patch('http://localhost:8000/backend/api/home/user/settings/', settingsData, {
        headers: {
          Authorization: `Bearer ${token}`,  // Pass token in headers
        },
      });
      console.log('Updated settings response:', response.data); // Logge die Antwortdaten
      return response.data;
    } catch (error) {
      console.error('Error updating user settings:', error); // Logge den Fehler
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    goals: '',
    pocket_enabled: false,
    email: '',
    name: '',
    status: 'idle',  // for tracking fetch status
    error: null
  },
  reducers: {
    setSettings(state, action) {
      const { goals, pocket_enabled, name } = action.payload;
      state.goals = goals;
      state.pocket_enabled = pocket_enabled;
      state.name = name;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user settings
      .addCase(fetchUserSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { email, name, goals, pocket_enabled } = action.payload;
        state.email = email;
        state.name = name;
        state.goals = goals;
        state.pocket_enabled = pocket_enabled;
      })
      .addCase(fetchUserSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update user settings
      .addCase(updateUserSettings.pending, (state) => {
        state.status = 'updating';
      })
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        state.status = 'updated';
        const { email, name, goals, pocket_enabled } = action.payload;
        state.email = email;
        state.name = name;
        state.goals = goals;
        state.pocket_enabled = pocket_enabled;
      })
      .addCase(updateUserSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { setSettings } = settingsSlice.actions;
export const selectSettings = (state) => state.settings;
export default settingsSlice.reducer;
