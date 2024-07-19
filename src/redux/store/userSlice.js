// Package
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Auth, API } from 'aws-amplify';

// Local
import { institution } from '../../utils/constants.js';


// Code
export const fetchUserData = createAsyncThunk(
    'user/fetchData',
    async () => {
        const user = await Auth.currentAuthenticatedUser();
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
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUserData.fulfilled, (state, action) => {
            state.isAuth = true;
            state.data = action.payload;
        });
    }
})

export default userSlice.reducer;