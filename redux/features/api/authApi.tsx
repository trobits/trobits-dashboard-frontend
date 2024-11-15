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
        })
    })
})

export const { useLoginUserMutation,useLogoutQuery,useLazyLogoutQuery } = authApi;