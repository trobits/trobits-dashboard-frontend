

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import "./TextEditor.css";
import { Button } from "../ui/button";
import { CircleX } from "lucide-react";
import { useCreateBlogMutation } from "@/redux/features/api/blogApi";
import toast from "react-hot-toast";

const TextEditor: React.FC = () => {
    const [ editorContent, setEditorContent ] = useState<string>("");
    const [ blogTitle, setBlogTitle ] = useState<string>("");
    const [ showPreview, setShowPreview ] = useState(false);
    const [ createBlogMutation, { isLoading: createBlogLoading } ] = useCreateBlogMutation();

    const handleTitleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setBlogTitle(event.target.value);
    };

    const handleContentChange = (content: string) => {
        setEditorContent(content);
    };

    const handleSaveBlog = async () => {
        const artileCreationsLoading = toast.loading("Creating Article")
        try {
            if (!blogTitle || !editorContent) {
                toast.error("Please fill required information!");
                return;
            }

            const blogData = {
                authorId: "6732ca2128299c6a8049e0cd",
                title: blogTitle,
                content: editorContent,
            };

            const response = await createBlogMutation(blogData)
            if (response?.error) {
                toast.error("Error creating")
                return;
            }

            toast.success("Article Created Successfully.")
            setBlogTitle("");
            setEditorContent("");
            console.log("Blog Data:", blogData);
            // Later: Call the API to send data to the backend
        } catch (error) {
            toast.error("Error creating")
        } finally {
            toast.dismiss(artileCreationsLoading);
        }
    };

    return (
        <div className="text-editor-container">
            <h2 className="title">Create Your Blog</h2>

            {/* Blog Title Section */}
            <div className="form-group">
                <label className="input-label" htmlFor="blog-title">
                    Enter Your Blog Title
                </label>
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

            {/* SunEditor for Blog Content */}
            <div className="editor-section">
                <SunEditor
                    setContents={editorContent}
                    onChange={handleContentChange}
                    setOptions={{
                        height: "60vh",
                        width: "100%",
                        buttonList: [
                            [ "undo", "redo", "bold", "italic", "underline", "strike" ],
                            [ "list", "outdent", "indent" ],
                            [ "align" ],
                            [ "font", "fontSize", "formatBlock" ],
                            [ "fontColor", "hiliteColor" ],
                            [ "link", "image", "video" ],
                            [ "removeFormat" ],
                            [ "table", "horizontalRule", "subscript", "superscript" ],
                        ],
                        font: [
                            "Arial",
                            "Comic Sans MS",
                            "Courier New",
                            "Impact",
                            "Georgia",
                            "Tahoma",
                            "Trebuchet MS",
                            "Verdana",
                        ],
                        fontSize: [ 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 48, 64, 72 ],
                    }}
                    placeholder="Start writing your blog content here..."
                />
            </div>

            {/* Save Blog Button */}
            <button
                className="block w-full px-4 py-3 mt-5 bg-blue-500 text-white border-none rounded-lg text-lg cursor-pointer transition-colors duration-300 hover:bg-blue-700"
                onClick={handleSaveBlog}
            >
                Save Blog
            </button>

            {/* Show Preview */}
            <div className="flex justify-center items-center mt-4">
                <Button onClick={() => setShowPreview((prev) => !prev)}>
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

                            {/* Blog Preview */}
                            <div className="mt-8 flex flex-col mx-auto">
                                {/* Blog Title */}
                                <h4 className="text-center text-4xl font-semibold text-gray-800 mb-4">
                                    {blogTitle}
                                </h4>

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


