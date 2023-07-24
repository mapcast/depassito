import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    completed: boolean,
    password: string,
}

const initialState: AuthState = {
    completed: false,
    password: ''
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setPassword(state, password) {
            state.password = password.payload;
        },
        setAuthComplete(state, password) {
            state.completed = true;
            state.password = password.payload;
        }
    },
    extraReducers: (builder) => {}
});

export const { setPassword, setAuthComplete } = authSlice.actions;
export default authSlice.reducer;