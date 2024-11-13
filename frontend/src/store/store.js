import {configureStore} from '@reduxjs/toolkit'
import userSlice from './slices/userSlice'
import settingsReducer from './slices/settingsSlice';
import authReducer from './slices/authSlice';

export default configureStore({
    reducer: {
        User: userSlice,
        auth: authReducer,
        settings: settingsReducer,

    },
})