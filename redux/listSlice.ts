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
        setList(state, action) {
            state.names = action.payload;
        },
        addPassword(state, action) {
            state.names.push(action.payload);
        },
        deletePassword(state, action) {
            state.names = state.names.filter((name) => name != action.payload);
        }
    },
    extraReducers: (builder) => {}
});

export const { setList, addPassword, deletePassword } = listSlice.actions;
export default listSlice.reducer;