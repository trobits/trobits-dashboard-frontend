/* eslint-disable @typescript-eslint/no-explicit-any */

import { Article } from "@/app/dashboard/layout";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Partial<Article> = {
    title: "",
    content: "",
    id: "",
    image: "",
    authorId: "",
    likeCount: 0,
    likers: [],
    comments: [],
    createdAt: undefined,
    updatedAt: undefined,
};

const articleSlice = createSlice({
    name: "article",
    initialState,
    reducers: {
        setEditableArticle: (state, action: PayloadAction<Article>) => {
            const article = action.payload;
            state.title = article.title;
            state.content = article.content;
            state.id = article.id;
            state.image = article.image;
            state.authorId = article.authorId;
            // state.likeCount = article.likeCount;
            // state.likers = article.likers;
            // state.comments = article.comments;
            // state.createdAt = article.createdAt;
            // state.updatedAt = article.updatedAt;
        },
        clearEditableArticle: (state) => {
            state.title = "";
            state.content = "";
            state.id = "";
            state.image = "";
            state.authorId = "";
            // state.likeCount = 0;
            // state.likers = [];
            // state.comments = [];
        },
    },
});

export const { setEditableArticle, clearEditableArticle } = articleSlice.actions;
export default articleSlice.reducer;
