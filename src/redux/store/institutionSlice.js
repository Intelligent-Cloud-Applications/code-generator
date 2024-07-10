import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API } from 'aws-amplify';
import { institution } from '../../utils/constants.js';

export const fetchInstitutionData = createAsyncThunk(
    'institution/fetchInstitutionData',
    async () => {
        return await API.get(
            'prod',
            `/any/get-institution-data/${ institution }`,
            {}
        );
    }
)

const institutionSlice = createSlice({
    name: 'institution',
    initialState: {
        data: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchInstitutionData.fulfilled, (state, action) => {
            state.data = action.payload;
        })
    }
});

export default institutionSlice.reducer;