// Package
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Auth, API } from 'aws-amplify';

// Local
import { institution } from '../../utils/constants.js';


// Code
export const fetchProductData = createAsyncThunk(
    'product/fetchData',
    async () => {
        return await API.get(
            'main',
            `/any/products/${ institution }`,
            {}
        );
    }
)


const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProductData.fulfilled, (state, action) => {
            state.list = action.payload;
        });
    }
})

export default productSlice.reducer;