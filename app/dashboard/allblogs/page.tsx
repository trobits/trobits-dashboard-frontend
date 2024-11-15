
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Eye, Trash2, XCircle } from "lucide-react";
import { useDeleteBlogMutation, useGetAllBlogsQuery } from "@/redux/features/api/blogApi";
import React, { useState } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/redux/hooks";
import { setEditableBlog } from "@/redux/features/slices/blogSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loading from "@/components/shared/Loading";


export type BlogCategory =
  | "material"
  | "instrumentation"
  | "design"
  | "technology"
  | "strengthening"
  | "uncategorized";

export type TBlog = {
  id: string;
  blogTitle: string;
  blogImage?: string;
  blogContent: string;
  category: BlogCategory;
  comments?: any;
  createdAt?: Date;
  updatedAt?: Date;
};

const AllBlogPage = () => {
  const { data, isLoading } = useGetAllBlogsQuery([]);
  const [ showPreview, setShowPreview ] = useState<boolean>(false);
  const [ selectedBlog, setSelectedBlog ] = useState<TBlog | null>(null);
  const [ deleteBlog ] = useDeleteBlogMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  if (isLoading) return <Loading />;

  const blogs = data?.data;

  const handlePreview = (blog: TBlog) => {
    setSelectedBlog(blog);
    setShowPreview(true);
  };

  const handleEditBlog = (blog: TBlog) => {
    dispatch(setEditableBlog(blog));
    router.push("/dashboard/addblog");
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      const result = await deleteBlog(id);
      console.log({ result })
      if (result.error) {
        toast.error("failed to delete blog!");
      }
      if (result?.data?.success) {
        toast.success("Blog deleted successfully!");
      }
    } catch (error: any) {
      toast.error("Failed to delete blog!");
    }
  };
  if (!blogs?.length) {
    return <p>No blog found</p>
  }
  return (
    <div className="space-y-4">
      {blogs && blogs?.map((blog: TBlog) => (
        <Card
          key={blog.id}
          className="flex flex-col md:flex-row shadow-md rounded-lg overflow-hidden"
        >
          {/* Blog Image */}
          {blog.blogImage && (
            <Image
              height={700}
              width={700}
              src={blog.blogImage}
              alt={blog.blogTitle}
              className="w-full md:w-32 h-48 md:h-32 object-cover p-2 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 m-2"
            />
          )}
          <div className="p-4 flex-1">
            <h3 className="text-lg font-bold">{blog.blogTitle}</h3>
            <div
              className="text-gray-600 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: blog.blogContent }}
            />
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                className="bg-blue-400 hover:bg-blue-500 font-bold text-white"
                size="sm"
                onClick={() => handlePreview(blog)}
              >
                <Eye className="mr- h-4 w-4" />
                Preview
              </Button>
              <Button
                variant="outline"
                className="bg-yellow-500 font-bold hover:bg-yellow-600 text-white"
                size="sm"
                onClick={() => handleEditBlog(blog)}
              >
                <Edit className="mr- h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                className="font-bold"
                size="sm"
                onClick={() => handleDeleteBlog(blog.id)}
              >
                <Trash2 className="mr- h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {/* Preview Modal */}
      {showPreview && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl p-6 relative overflow-auto max-h-[95vh] mx-4">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white bg-black hover:bg-gray-800 px-2 py-2 rounded-md flex justify-center items-center text-2xl font-bold"
              onClick={() => setShowPreview(false)}
            >
              <XCircle />
            </button>

            {/* Preview Heading */}
            <div className="text-center mb-4">
              <h3 className="text-black text-3xl font-bold">Preview</h3>
            </div>

            {/* Blog Preview Card */}
            <div className="mt-8 flex flex-col mx-auto">
              {/* Blog Title */}
              <h4 className="text-center text-4xl font-semibold text-gray-800 mb-4">
                {selectedBlog.blogTitle}
              </h4>

              {/* Blog Category */}
              <div className="flex justify-center mb-6">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-4 py-2 rounded-lg shadow">
                  Category: {selectedBlog.category}
                </span>
              </div>

              {/* Blog Image */}
              {selectedBlog.blogImage && (
                <div className="flex justify-center mb-6">
                  <Image
                    width={700}
                    height={700}
                    src={selectedBlog.blogImage}
                    alt="Selected Blog"
                    className="w-full max-w-5xl h-auto object-cover rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* Blog Content */}
              <div className="prose max-w-none text-gray-700">
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedBlog.blogContent,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBlogPage;
