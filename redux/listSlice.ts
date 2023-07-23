import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    names: Array<string>,
}

const initialState: AuthState = {
    names: []
};

export const listSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        addPassword(state, action) {
            state.names.push(action.payload);
        },
        deletePassword(state, action) {
            state.names = state.names.filter((name) => name != action.payload);
        }
    },
    extraReducers: (builder) => {}
});

export const { addPassword, deletePassword } = listSlice.actions;
export default listSlice.reducer;