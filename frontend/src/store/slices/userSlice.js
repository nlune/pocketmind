import {createSlice} from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {user: undefined, accessToken: undefined, loggedIn: false},
    reducers: {
        loginUser: (state, action) => {
            state.user = action.payload.user
            state.accessToken = action.payload.accessToken
            state.loggedIn = true
        },
        logoutUser: (state) => {
            state.loggedIn = false
            state.user = null
            state.accessToken = null
        }
    },
})
export const {loginUser, logoutUser} = userSlice.actions
export default userSlice.reducer