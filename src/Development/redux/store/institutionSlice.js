import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API } from 'aws-amplify';
import institutionData from '../../utils/constants';

export const fetchInstitutionData = createAsyncThunk(
    'institution/fetchInstitutionData',
    async () => {
        return await API.get(
            'prod',
            `/any/get-institution-data/${institutionData.InstitutionId }`,
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