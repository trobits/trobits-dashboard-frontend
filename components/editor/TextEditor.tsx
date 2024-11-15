
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { ChangeEvent, useEffect, useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import './TextEditor.css';
import Image from "next/image";
import { Button } from "../ui/button";
import { CircleX } from "lucide-react";
import { useCreateBlogMutation, useUpdateBlogMutation } from "@/redux/features/api/blogApi";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearSetEditableBlog } from "@/redux/features/slices/blogSlice";

const TextEditor: React.FC = () => {
    const editableBlog = useAppSelector((state) => state.blog);
    const dispatch = useAppDispatch();
    const [ isEditMode, setIsEditMode ] = useState<boolean>(editableBlog?.blogTitle ? true : false);
    const [ editorContent, setEditorContent ] = useState<string>(editableBlog.blogContent || "");
    const [ blogTitle, setBlogTitle ] = useState<string>(editableBlog.blogTitle || "");
    const [ blogType, setBlogType ] = useState<string>(editableBlog.category || "Category");
    const [ selectedImageFile, setSelectedImageFile ] = useState<File | null>(null);
    const [ selectedImagePreview, setSelectedImagePreview ] = useState<string | null>(editableBlog.blogImage || null);
    const [ createBlog, { isLoading: blogCreationLoading } ] = useCreateBlogMutation();
    const [ updateBlog, { isLoading: blogUpdateLoading } ] = useUpdateBlogMutation();
    const [ showPreview, setShowPreview ] = useState(false);

    useEffect(() => {
        // check if browser is available for access localStorage. then set all information on localStorage
        if (typeof window !== "undefined") {
            const savedContent = editableBlog.blogContent || localStorage.getItem("blogContent") || "";
            const savedTitle = editableBlog.blogTitle || localStorage.getItem("blogTitle") || "";
            const savedBlogType = editableBlog.category || localStorage.getItem("blogType") || "Category";
            const savedImage = editableBlog.blogImage || localStorage.getItem("selectedImage") || null;
            setEditorContent(savedContent);
            setBlogTitle(savedTitle);
            setBlogType(savedBlogType);
            setSelectedImagePreview(savedImage);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBlogTitle(event.target.value);
        localStorage.setItem("blogTitle", event.target.value);
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setBlogType(event.target.value);
        localStorage.setItem("blogType", event.target.value);
    };

    const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[ 0 ];
        if (file) {
            setSelectedImageFile(file);
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onloadend = () => {
                setSelectedImagePreview(fileReader.result as string);
                localStorage.setItem("selectedImage", fileReader.result as string);
            };
        }
    };

    const handleContentChange = (content: string) => {
        setEditorContent(content);
        localStorage.setItem("blogContent", content);
    };

    const handleSaveBlog = async () => {
        if (!blogTitle || !blogType || !editorContent) {
            toast.error("Please fill required information!");
            return;
        }

        // handle update logic if edit mode
        if (isEditMode) {
            const loadingToastId = toast.loading("Updating your blog...");
            try {
                const formData = new FormData();
                formData.append("id", (editableBlog.id as string));
                formData.append("blogTitle", blogTitle);
                formData.append("category", blogType);
                formData.append("blogContent", editorContent);

                if (selectedImageFile) {
                    formData.append("blogImage", selectedImageFile);
                }

                const result = await updateBlog({ id: editableBlog.id, formData });

                if (result.error) {
                    toast.error((result?.error as any)?.message || "Failed to update blog!");
                    return;
                }
                toast.success("Blog updated successfully!");
                localStorage.removeItem("blogTitle");
                localStorage.removeItem("blogType");
                localStorage.removeItem("blogContent");
                localStorage.removeItem("selectedImage");
                setBlogTitle("");
                setBlogType("Category");
                setEditorContent("");
                setSelectedImagePreview(null);
                setSelectedImageFile(null);
                // clear editable blog from redux store
                dispatch(clearSetEditableBlog());
                return;
            } catch (error: any) {
                toast.error("An error occurred while updating the blog.");
                return
            } finally {
                toast.dismiss(loadingToastId);
                return
            }

        }
        const loadingToastId = toast.loading("Uploading your blog...");

        try {
            const formData = new FormData();
            formData.append("blogTitle", blogTitle);
            formData.append("category", blogType);
            formData.append("blogContent", editorContent);

            if (selectedImageFile) {
                formData.append("blogImage", selectedImageFile);
            }

            const result = await createBlog(formData);

            if (result.error) {
                toast.error((result?.error as any)?.message || "Failed to create blog!");
                return;
            }

            toast.success("Blog created successfully!");

            localStorage.removeItem("blogTitle");
            localStorage.removeItem("blogType");
            localStorage.removeItem("blogContent");
            localStorage.removeItem("selectedImage");
            setBlogTitle("");
            setBlogType("Category");
            setEditorContent("");
            setSelectedImagePreview(null);
            setSelectedImageFile(null);
        } catch (error: any) {
            toast.error("An error occurred while creating the blog.");
        } finally {
            toast.dismiss(loadingToastId);
        }
    };

    return (
        <div className="">
            <h2 className="title">Create Your Blog</h2>

            {/* Blog Title Section */}
            <div className="form-group">
                <label className="input-label" htmlFor="blog-title">Enter Your Blog Title</label>
                <input
                    id="blog-title"
                    type="text"
                    required
                    value={blogTitle}
                    onChange={handleTitleChange}
                    placeholder="Enter Blog Title"
                    className="blog-title"
                />
            </div>

            {/* Blog Category Section */}
            <div className="form-group">
                <label className="input-label" htmlFor="blog-category">Choose Your Blog Category</label>
                <select
                    id="blog-category"
                    value={blogType}
                    onChange={handleCategoryChange}
                    className="blog-type"
                >
                    <option value="uncategorized" disabled>Categories</option>
                    <option value="strengthening">Strengthening</option>
                    <option value="technology">Technology</option>
                    <option value="design">Design</option>
                    <option value="instrumentation">Instrumentation</option>
                    <option value="material">Material</option>
                </select>
            </div>

            {/* Blog Image Section */}
            <div className="gap-3 my-4">
                <h1 className="text-lg font-semibold">Blog Image:</h1>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border-2 w-96 p-1 border-gray-700 rounded-md"
                />
            </div>

            {/* SunEditor for Blog Content */}
            <div className="">
                <SunEditor
                    setContents={editorContent}
                    onChange={handleContentChange}
                    setOptions={{
                        height: "60vh",
                        width: "100vw",
                        buttonList: [
                            [ "undo", "redo", "bold", "italic", "underline", "strike" ],
                            [ "list", "outdent", "indent" ],
                            [ "align" ],
                            [ "font", "fontSize", "formatBlock" ],
                            [ "fontColor", "hiliteColor" ],
                            [ "link", "image", "video" ],
                            [ "removeFormat" ],
                            [ "table", "horizontalRule", "subscript", "superscript" ]
                        ],
                        font: [ "Arial", "Comic Sans MS", "Courier New", "Impact", "Georgia", "Tahoma", "Trebuchet MS", "Verdana" ],
                        fontSize: [ 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 48, 64, 72 ]
                    }}
                    placeholder="Start writing your blog content here..."
                />
            </div>

            {/* Save Blog Button */}
            <button
                disabled={(blogCreationLoading || blogUpdateLoading) }
                className="block w-full px-4 py-3 mt-5 bg-blue-500 text-white border-none rounded-lg text-lg cursor-pointer transition-colors duration-300 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleSaveBlog}
            >
                Save Blog
            </button>

            {/* Show Preview */}
            <div className="flex justify-center items-center mt-4">
                <Button
                    onClick={() => setShowPreview((prev) => !prev)}
                >
                    {showPreview ? "Hide Preview" : "Show Preview"}
                </Button>

                {showPreview && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl p-6 relative overflow-auto max-h-[95vh] mx-4">
                            {/* Close Button */}
                            <button
                                className="absolute top-4 right-4 text-white bg-black hover:bg-gray-800 px-2 py-2 rounded-md flex justify-center items-center text-2xl font-bold"
                                onClick={() => setShowPreview(false)}
                            >
                                <CircleX />
                            </button>

                            {/* Preview Heading */}
                            <div className="text-center mb-4">
                                <h3 className="text-black text-3xl font-bold">Preview</h3>
                            </div>

                            {/* Blog Preview Card */}
                            <div className="mt-8 flex flex-col mx-auto">
                                {/* Blog Title */}
                                <h4 className="text-center text-4xl font-semibold text-gray-800 mb-4">{blogTitle}</h4>

                                {/* Blog Category */}
                                <div className="flex justify-center mb-6">
                                    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-4 py-2 rounded-lg shadow">
                                        Category: {blogType}
                                    </span>
                                </div>

                                {/* Blog Image */}
                                {selectedImagePreview && (
                                    <div className="flex justify-center mb-6">
                                        <Image
                                            width={100}
                                            height={100}
                                            src={selectedImagePreview}
                                            alt="Selected Blog"
                                            className="w-full max-w-5xl h-auto object-cover rounded-lg shadow-md"
                                        />
                                    </div>
                                )}

                                {/* Blog Content */}
                                <div className="prose max-w-none text-gray-700">
                                    <div dangerouslySetInnerHTML={{ __html: editorContent }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TextEditor;

















