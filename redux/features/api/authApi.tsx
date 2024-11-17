import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        loginUser: build.mutation({
            query: (data) => {
                return {
                    url: `/user/login `,
                    method: "POST",
                    body: data
                }
            }
        }),
        logout: build.query({
            query: () => {
                return {
                    url: "/user/logout",
                    method: "GET"
                }
            }
        }),
        getUserById: build.query({
            query: (userId) => {
                return {
                    url: `/user/singleUser/${userId}`,
                    method: "GET",

                }
            },
        }),
        getAllUsers: build.query({
            query: () => {
                return {
                    url: `/user/all-users`,
                    method: "GET",

                }
            },
            providesTags: [ "user" ]
        }),
        getAllRecommendedUsers: build.query({
            query: () => {
                return {
                    url: `/user/recommended-users`,
                    method: "GET",
                }
            },
            providesTags: [ "recommended-user" ]
        }),
        getAllVerifiedUsers: build.query({
            query: () => {
                return {
                    url: `/user/verified-users`,
                    method: "GET",
                }
            },
            providesTags: [ "verified-user" ]
        }),
        getAllBlockedUsers: build.query({
            query: () => {
                return {
                    url: `/user/blocked-users`,
                    method: "GET",
                }
            },
            providesTags: [ "blocked-user" ]
        }),
        toggleVerifiedAndRecommended: build.mutation({
            query: (data) => {
                return {
                    url: `/user/toggle-recommend`,
                    method: "PATCH",
                    body: data

                }
            },
            invalidatesTags: [ "recommended-user", "verified-user" ]
        }),
        toggleBlocked: build.mutation({
            query: (data) => {
                return {
                    url: `/user/toggle-blocked`,
                    method: "PATCH",
                    body: data

                }
            },
            invalidatesTags: [ "recommended-user", "verified-user", "blocked-user" ]
        }),


    })
})

export const {
    useGetUserByIdQuery,
    useGetAllUsersQuery,
    useToggleVerifiedAndRecommendedMutation,
    useGetAllRecommendedUsersQuery,
    useToggleBlockedMutation,
    useGetAllVerifiedUsersQuery,
    useGetAllBlockedUsersQuery,
    useLoginUserMutation,
    useLazyGetUserByIdQuery,
    useLogoutQuery,
    useLazyLogoutQuery } = authApi;