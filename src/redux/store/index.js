import { configureStore } from '@reduxjs/toolkit';
import institutionReducer from './institutionSlice';
import userReducer from './userSlice';

export const store = configureStore({
    reducer: {
        institutionData: institutionReducer,
        userData: userReducer,
    },
});