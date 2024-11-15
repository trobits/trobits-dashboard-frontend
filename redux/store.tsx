import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./features/api/baseApi";
import authReducer from ".//features/slices/authSlice";
import blogReducer from ".//features/slices/blogSlice";

export const store = configureStore({
    reducer: {
        [ baseApi.reducerPath ]: baseApi.reducer,
        auth: authReducer,
        blog:blogReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
