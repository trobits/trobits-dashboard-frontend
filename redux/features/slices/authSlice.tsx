
import { User } from "@/app/dashboard/layout";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
    user: User | null;
}

const initialState: IInitialState = {
    user: null,
};

// Create the slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload.user;
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("token")
        },
    },
});

// Export actions and reducer
export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
