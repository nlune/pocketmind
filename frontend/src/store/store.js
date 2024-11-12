import {configureStore} from '@reduxjs/toolkit'
import userSlice from './slices/userSlice'
import settingsReducer from './slices/settingsSlice';

export default configureStore({
    reducer: {
        User: userSlice,
        settings: settingsReducer,
    },
})