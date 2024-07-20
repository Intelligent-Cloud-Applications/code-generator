import { configureStore } from '@reduxjs/toolkit';
import institutionReducer from './institutionSlice';
import userReducer from './userSlice';
import productReducer from './productSlice';

export const store = configureStore({
    reducer: {
        institutionData: institutionReducer,
        userData: userReducer,
        products: productReducer,
    },
});