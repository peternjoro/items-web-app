import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';

// configure redux store using redux toolkit
const store = configureStore({
    reducer: {
        'user': userReducer
    },
    devTools: false
});
export default store;