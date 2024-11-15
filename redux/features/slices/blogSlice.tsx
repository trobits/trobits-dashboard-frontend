/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type TBlog = {
    id: string;
    blogTitle: string;
    blogImage?: string;
    blogContent: string;
    category: string;
    comments?: any;
    createdAt?: Date;
    updatedAt?: Date;
};
const initialState: Partial<TBlog> = {
    blogContent: "",
    blogTitle: "",
    category: "",
    id: "",
    blogImage: "",
}

const blogSlice = createSlice({
    name: "blog",
    initialState,
    reducers: {
        setEditableBlog: (state, action: PayloadAction<TBlog>) => {
            const blog = action.payload;
            state.blogContent = blog.blogContent;
            state.blogTitle = blog.blogTitle;
            state.category = blog.category;
            state.id = blog.id;
            state.blogImage = blog.blogImage;
        },
        clearSetEditableBlog: (state) => {
            state.blogContent = "";
            state.blogTitle = "";
            state.category = "";
            state.id = "";
            state.blogImage = "";
        }
    }

})

export const { setEditableBlog,clearSetEditableBlog } = blogSlice.actions;
export default blogSlice.reducer;