import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action to fetch user settings from backend
// Async action to fetch user settings with authorization
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

          return response.data;
      } catch (error) {
          return rejectWithValue(error.response.data);
      }
  }
);

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        goals: '',
        pocket: false,
        email: '',
        name: '',
        status: 'idle', // for tracking fetch status
        error: null
    },
    reducers: {
        updateSettings(state, action) {
            const { goals, pocket, name } = action.payload;
            state.goals = goals;
            state.pocket = pocket;
            state.name = name;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserSettings.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserSettings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { email, name, goals, pocket } = action.payload;
                state.email = email;
                state.name = name;
                state.goals = goals;
                state.pocket = pocket;
            })
            .addCase(fetchUserSettings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { updateSettings } = settingsSlice.actions;
export const selectSettings = (state) => state.settings;
export default settingsSlice.reducer;
