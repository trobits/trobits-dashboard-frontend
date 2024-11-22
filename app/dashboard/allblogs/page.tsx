



// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Edit, Eye, Trash2, XCircle } from "lucide-react";
// import { useDeleteBlogMutation, useGetAllBlogsQuery } from "@/redux/features/api/blogApi";
// import React, { useState } from "react";
// import Image from "next/image";
// import { useAppDispatch } from "@/redux/hooks";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import Loading from "@/components/shared/Loading";
// import { Article } from "../layout";
// import { setEditableArticle } from "@/redux/features/slices/blogSlice";

// const AllArticlePage = () => {
//   const { data, isLoading } = useGetAllBlogsQuery([]);
//   const [ showPreview, setShowPreview ] = useState<boolean>(false);
//   const [ selectedArticle, setSelectedArticle ] = useState<Article | null>(null);
//   const [ deleteArticle ] = useDeleteBlogMutation();
//   const dispatch = useAppDispatch();
//   const router = useRouter();

//   if (isLoading) return <Loading />;

//   const articles = data?.data;

//   const handlePreview = (article: Article) => {
//     setSelectedArticle(article);
//     setShowPreview(true);
//   };

//   const handleEditArticle = (article: Article) => {
//     console.log({ article });
//     dispatch(setEditableArticle(article));
//     router.push("/dashboard/addblog");
//   };

//   const handleDeleteArticle = (id: string) => {
//     toast(
//       (t) => (
//         <div className="flex flex-col items-center space-y-2">
//           <p>Do you want to delete this article?</p>
//           <div className="flex space-x-4">
//             <Button
//               size="sm"
//               className="bg-red-500 text-white"
//               onClick={async () => {
//                 try {
//                   const result = await deleteArticle(id);
//                   if (result.error) {
//                     toast.error("Failed to delete article!");
//                   } else if (result?.data?.success) {
//                     toast.success("Article deleted successfully!");
//                     toast.dismiss(t.id); // Dismiss the confirmation toast
//                   }
//                 } catch {
//                   toast.error("Failed to delete article!");
//                 }
//               }}
//             >
//               Yes
//             </Button>
//             <Button
//               size="sm"
//               variant="outline"
//               onClick={() => toast.dismiss(t.id)} // Dismiss the confirmation toast
//             >
//               No
//             </Button>
//           </div>
//         </div>
//       ),
//       {
//         duration: Infinity, // Keep the toast open until user responds
//       }
//     );
//   };

//   if (!articles?.length) {
//     return <p>No articles found</p>;
//   }

//   return (
//     <div className="space-y-4 w-full">
//       {articles &&
//         articles.map((article: Article) => (
//           <Card
//             key={article.id}
//             className="flex flex-col md:flex-row shadow-md rounded-lg overflow-hidden"
//           >
//             {/* Article Image or Placeholder */}
//             <div className="w-full md:w-32 h-48 md:h-32 flex items-center justify-center border-4 border-cyan-600 m-1 rounded-lg p-1 bg-gray-200">
//               {article.image ? (
//                 <Image
//                   height={128} // Predefined size for the image
//                   width={128}
//                   src={article.image}
//                   alt={article.title}
//                   className="object-cover w-full h-full"
//                 />
//               ) : (
//                 <div className="text-gray-400 text-sm font-medium">Blog</div>
//               )}
//             </div>

//             {/* Article Title */}
//             <div className="p-2 md:p-4 flex-1">
//               <h3 className="text-lg font-bold text-gray-800">{article.title}</h3>
//               <div className="flex justify-end space-x-2 mt-4">
//                 <Button
//                   variant="outline"
//                   className="bg-blue-400 hover:bg-blue-500 font-normal md:font-bold text-white"
//                   size="sm"
//                   onClick={() => handlePreview(article)}
//                 >
//                   <Eye className="mr- h-4 w-4" />
//                   Preview
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="bg-yellow-500 font-normal md:font-bold hover:bg-yellow-600 text-white"
//                   size="sm"
//                   onClick={() => handleEditArticle(article)}
//                 >
//                   <Edit className="mr- h-4 w-4" />
//                   Edit
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   className="font-normal md:font-bold"
//                   size="sm"
//                   onClick={() => handleDeleteArticle(article.id)}
//                 >
//                   <Trash2 className="mr- h-4 w-4" />
//                   Delete
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         ))}

//       {/* Preview Modal */}
//       {showPreview && selectedArticle && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl p-6 relative overflow-auto max-h-[95vh] mx-4">
//             {/* Close Button */}
//             <button
//               className="absolute top-4 right-4 text-white bg-black hover:bg-gray-800 px-2 py-2 rounded-md flex justify-center items-center text-2xl font-bold"
//               onClick={() => setShowPreview(false)}
//             >
//               <XCircle />
//             </button>

//             {/* Preview Heading */}
//             <div className="text-center mb-4">
//               <h3 className="text-black text-3xl font-bold">Preview</h3>
//             </div>

//             {/* Article Preview Card */}
//             <div className="mt-8 flex flex-col mx-auto">
//               {/* Article Title */}
//               <h4 className="text-center text-4xl font-semibold text-gray-800 mb-4">
//                 {selectedArticle.title}
//               </h4>

//               {/* Article Image */}
//               {selectedArticle.image && (
//                 <div className="flex justify-center mb-6">
//                   <Image
//                     width={700}
//                     height={700}
//                     src={selectedArticle.image}
//                     alt="Selected Article"
//                     className="w-full max-w-5xl h-auto object-cover rounded-lg shadow-md"
//                   />
//                 </div>
//               )}

//               {/* Article Content */}
//               <div className="prose max-w-none text-gray-700">
//                 <div
//                   dangerouslySetInnerHTML={{
//                     __html: selectedArticle.content,
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllArticlePage;











"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Eye, Trash2, XCircle, Search } from "lucide-react";
import { useDeleteBlogMutation, useGetAllBlogsQuery } from "@/redux/features/api/blogApi";
import Image from "next/image";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loading from "@/components/shared/Loading";
import { Article } from "../layout";
import { setEditableArticle } from "@/redux/features/slices/blogSlice";
import { debounce } from "lodash";

const AllArticlePage = () => {
  const { data, isLoading } = useGetAllBlogsQuery([]);
  const [ showPreview, setShowPreview ] = useState<boolean>(false);
  const [ selectedArticle, setSelectedArticle ] = useState<Article | null>(null);
  const [ deleteArticle ] = useDeleteBlogMutation();
  const [ searchTerm, setSearchTerm ] = useState<string>("");
  const [ filteredArticles, setFilteredArticles ] = useState<Article[]>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();



  const articles = useMemo(() => data?.data || [], [ data?.data ]);

  // Initialize filtered articles when articles data is fetched
  useEffect(() => {
    setFilteredArticles(articles);
  }, [articles]);

  const debouncedSearch = debounce((term: string) => {
    const filtered = articles.filter((article:Article) =>
      article.title.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, 300);

  if (isLoading) return <Loading />;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handlePreview = (article: Article) => {
    setSelectedArticle(article);
    setShowPreview(true);
  };

  const handleEditArticle = (article: Article) => {
    dispatch(setEditableArticle(article));
    router.push("/dashboard/addblog");
  };

  const handleDeleteArticle = (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center space-y-2">
          <p>Do you want to delete this article?</p>
          <div className="flex space-x-4">
            <Button
              size="sm"
              className="bg-red-500 text-white"
              onClick={async () => {
                try {
                  const result = await deleteArticle(id);
                  if (result.error) {
                    toast.error("Failed to delete article!");
                  } else if (result?.data?.success) {
                    toast.success("Article deleted successfully!");
                    toast.dismiss(t.id); // Dismiss the confirmation toast
                  }
                } catch {
                  toast.error("Failed to delete article!");
                }
              }}
            >
              Yes
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.dismiss(t.id)} // Dismiss the confirmation toast
            >
              No
            </Button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // Keep the toast open until user responds
      }
    );
  };

  return (
    <div className="space-y-4 w-full">
      {/* Search Bar */}
      <div className="flex justify-between w-full items-center mb-4">
        <div className="relative flex w-full items-center bg-[#000000c5] font-bold text-white border-4 border-cyan-500 px-3 py-2 rounded-lg">
          <Search className="h-5 w-5 " />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by title..."
            className="bg-transparent outline-none w-full pl-2 "
          />
        </div>
      </div>

      {/* Articles List */}
      {filteredArticles.length ? (
        filteredArticles.map((article: Article) => (
          <Card
            key={article.id}
            className="flex flex-col md:flex-row shadow-md rounded-lg overflow-hidden"
          >
            {/* Article Image or Placeholder */}
            <div className="w-full md:w-32 h-48 md:h-32 flex items-center justify-center border-4 border-cyan-600 m-1 rounded-lg p-1 bg-gray-200">
              {article.image ? (
                <Image
                  height={128}
                  width={128}
                  src={article.image}
                  alt={article.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="text-gray-400 text-sm font-medium">No Image</div>
              )}
            </div>

            {/* Article Title */}
            <div className="p-2 md:p-4 flex-1">
              <h3 className="text-lg font-bold text-gray-800">{article.title}</h3>
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  className="bg-blue-400 hover:bg-blue-500 font-normal md:font-bold text-white"
                  size="sm"
                  onClick={() => handlePreview(article)}
                >
                  <Eye className="mr- h-4 w-4" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  className="bg-yellow-500 font-normal md:font-bold hover:bg-yellow-600 text-white"
                  size="sm"
                  onClick={() => handleEditArticle(article)}
                >
                  <Edit className="mr- h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="font-normal md:font-bold"
                  size="sm"
                  onClick={() => handleDeleteArticle(article.id)}
                >
                  <Trash2 className="mr- h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))
      ) : searchTerm ? (
        // Show "No Results" if search term exists but no articles are found
        <p className="text-center text-gray-500">No articles match your search.</p>
      ) : (
        // Show "No Articles Found" if there are no articles at all
        <p className="text-center text-gray-500">No articles found.</p>
      )}

      {/* Preview Modal */}
      {showPreview && selectedArticle && (
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

            {/* Article Preview Card */}
            <div className="mt-8 flex flex-col mx-auto">
              {/* Article Title */}
              <h4 className="text-center text-4xl font-semibold text-gray-800 mb-4">
                {selectedArticle.title}
              </h4>

              {/* Article Image */}
              {selectedArticle.image && (
                <div className="flex justify-center mb-6">
                  <Image
                    width={700}
                    height={700}
                    src={selectedArticle.image}
                    alt="Selected Article"
                    className="w-full max-w-5xl h-auto object-cover rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="prose max-w-none text-gray-700">
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedArticle.content,
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

export default AllArticlePage;
