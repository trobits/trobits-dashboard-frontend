import { baseApi } from "./baseApi";

const blogApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createBlog: build.mutation({
            query: (blogData) => {
                return {
                    url: "/blog/create-blog",
                    method: "POST",
                    body: blogData
                }
            }
        }),
        getAllBlogs: build.query({
            query: () => {
                return {
                    url: "/blog/all-blogs",
                    method: "GET"
                }
            },
            providesTags: [ 'blog' ],
        }),
        updateBlog: build.mutation({
            query: (data) => {

                return {
                    url: `/blog/update-blog/${data.id}`,
                    method: "PATCH",
                    body: data.formData
                }
            },
            invalidatesTags: [ 'blog' ]
        }),
        deleteBlog: build.mutation({
            query: (id) => {

                return {
                    url: `/blog/delete-blog/${id}`,
                    method: "DELETE",
                }
            },
            invalidatesTags: [ 'blog' ]
        }),
        getAllSubscriber: build.query({
            query: () => {
                return {
                    url: "/subscriber/all-subscriber",
                    method: "GET"
                }
            },
        })

    })
})

export const { useCreateBlogMutation, useGetAllSubscriberQuery, useGetAllBlogsQuery, useUpdateBlogMutation, useDeleteBlogMutation } = blogApi;