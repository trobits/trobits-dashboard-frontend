// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({
        // baseUrl: "http://localhost:3000/api/v1",
        // baseUrl: "https://sisiku-backend.vercel.app/api/v1",
        baseUrl: "https://api.trobits.com/api/v1",
        credentials: "include",
        prepareHeaders: (headers, { }) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }

            return headers;
        },
      
    }),
    tagTypes: [ "blog", "user","recommended-user","verified-user","lunc-burn","blocked-user","shiba-burn"],
    endpoints: () => ({}),
});


