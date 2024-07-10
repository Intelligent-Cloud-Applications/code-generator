// Package
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Auth, API } from 'aws-amplify';

// Local
import { institution } from '../../utils/constants.js';


// Code
export const fetchUserData = createAsyncThunk(
    'user/fetchData',
    async () => {
        console.log('HELLO1');
        const user = await Auth.currentAuthenticatedUser();
        console.log('HELLO2');
        if (user) {
            return await API.get(
                'main',
                `/user/profile/${ institution }`,
                {}
            );
        }
        return {};
    }
)


const userSlice = createSlice({
    name: 'user',
    initialState: {
        isAuth: false,
        data: {},
    },
    reducers: {
        logout: (state, _action) => {
            state.isAuth = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserData.fulfilled, (state, action) => {
            state.isAuth = true;
            state.data = action.payload;
        })
    }
})

export const { logout } = userSlice.actions;
export default userSlice.reducer;