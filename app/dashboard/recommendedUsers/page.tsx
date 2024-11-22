/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client"
// import Image from 'next/image';
// import React, { useState } from 'react';
// import { User } from '../layout';
// import { useGetAllRecommendedUsersQuery, useToggleBlockedMutation, useToggleVerifiedAndRecommendedMutation } from '@/redux/features/api/authApi';
// import Loading from '@/components/shared/Loading';
// import toast from 'react-hot-toast';

// const RecommendedUserPage = () => {
//     const { data: allUsersData, isLoading: allUsersDataLoading } = useGetAllRecommendedUsersQuery("");
//     const [ toggleVerifiedAndRecommended, { isLoading: toggleVerifiedAndRecommendedLoading } ] = useToggleVerifiedAndRecommendedMutation();
//     const [ toggleBlockedMutation, { isLoading: toggleBlockedLoading } ] = useToggleBlockedMutation();
//     const [ visibleUsersCount, setVisibleUsersCount ] = useState(20);

//     if (allUsersDataLoading) {
//         return <Loading />;
//     }

//     const handleAddRecommended = async (userId: string) => {
//         const toggleuserStatus = toast.loading("updating user status.")
//         try {
//             const response = await toggleVerifiedAndRecommended({ id: userId });
//             if (response.error) {
//                 toast.error("Failed to update user status!");
//                 return;
//             }
//             toast.success("User status updated successfully!");
//         } catch (error) {
//             toast.error("error while updating user status!")
//         } finally {
//             toast.dismiss(toggleuserStatus)
//         }
//     };

//     const handleBlockUser = async (userId: string) => {
//         const toggleuserStatus = toast.loading("updating user status.")
//         try {
//             const response = await toggleBlockedMutation({ id: userId });
//             if (response.error) {
//                 toast.error("Failed to update user status!");
//                 return;
//             }
//             toast.success("User status updated successfully!");
//         } catch (error) {
//             toast.error("error while updating user status!")
//         } finally {
//             toast.dismiss(toggleuserStatus)
//         }
//     };

//     const users: User[] = allUsersData?.data || [];

//     // Function to show more users
//     const handleShowMore = () => {
//         setVisibleUsersCount((prevCount) => prevCount + 20);
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
//             <div className="max-w-6xl mx-auto">
//                 <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
//                     Users Management
//                 </h1>
//                 <div className="bg-white shadow-lg rounded-lg p-6">
//                     <div className="text-gray-800 font-semibold mb-8 text-xl text-center">
//                         Recommended Users
//                     </div>
//                     <div className="space-y-4">
//                         {users.slice(0, visibleUsersCount).map((user: User) => (
//                             <div
//                                 key={user.id}
//                                 className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow"
//                             >
//                                 <div className="flex items-center space-x-4">
//                                     {user?.profileImage ? (
//                                         <Image
//                                             width={50}
//                                             height={50}
//                                             src={user?.profileImage}
//                                             alt={user.firstName}
//                                             className="w-14 h-14 rounded-full object-cover"
//                                         />
//                                     ) : (
//                                         <div className="w-14 h-14 rounded-full bg-blue-500 text-white flex justify-center items-center font-bold text-lg">
//                                             {user?.firstName.slice(0, 1).toUpperCase()}
//                                         </div>
//                                     )}
//                                     <span className="text-lg font-bold text-gray-700">
//                                         {`${user.firstName} ${user.lastName}`}
//                                     </span>
//                                 </div>
//                                 <div className="flex space-x-2">
//                                     <button
//                                         className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                                         onClick={() => handleAddRecommended(user.id)}
//                                     >
//                                         Remove from Recommended user
//                                     </button>
//                                     <button
//                                         className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
//                                         onClick={() => handleBlockUser(user.id)}
//                                     >
//                                         Block User
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                     {visibleUsersCount < users.length && (
//                         <div className="text-center mt-6">
//                             <button
//                                 className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600"
//                                 onClick={handleShowMore}
//                             >
//                                 Show More
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RecommendedUserPage;










"use client";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { User } from "../layout";
import {
    useGetAllRecommendedUsersQuery,
    useToggleBlockedMutation,
    useToggleVerifiedAndRecommendedMutation,
} from "@/redux/features/api/authApi";
import Loading from "@/components/shared/Loading";
import toast from "react-hot-toast";
import { debounce } from "lodash";

const RecommendedUserPage = () => {
    const { data: allUsersData, isLoading: allUsersDataLoading } = useGetAllRecommendedUsersQuery("");
    const [ toggleVerifiedAndRecommended, { isLoading: toggleVerifiedAndRecommendedLoading } ] =
        useToggleVerifiedAndRecommendedMutation();
    const [ toggleBlockedMutation, { isLoading: toggleBlockedLoading } ] = useToggleBlockedMutation();
    const [ visibleUsersCount, setVisibleUsersCount ] = useState(20);
    const [ searchTerm, setSearchTerm ] = useState("");
    const [ filteredUsers, setFilteredUsers ] = useState<User[]>([]);


    const users: User[] = useMemo(() => allUsersData?.data || [], [ allUsersData?.data ])

    // Initialize filtered users when users data is fetched
    React.useEffect(() => {
        setFilteredUsers(users);
    }, [ users ]);

    if (allUsersDataLoading) {
        return <Loading />;
    }


    // Debounced search function
    const debouncedSearch = debounce((term: string) => {
        const filtered = users.filter((user) =>
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, 300);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const handleAddRecommended = async (userId: string) => {
        const toggleuserStatus = toast.loading("Updating user status...");
        try {
            const response = await toggleVerifiedAndRecommended({ id: userId });
            if (response.error) {
                toast.error("Failed to update user status!");
                return;
            }
            toast.success("User status updated successfully!");
        } catch (error) {
            toast.error("Error while updating user status!");
        } finally {
            toast.dismiss(toggleuserStatus);
        }
    };

    const handleBlockUser = async (userId: string) => {
        const toggleuserStatus = toast.loading("Updating user status...");
        try {
            const response = await toggleBlockedMutation({ id: userId });
            if (response.error) {
                toast.error("Failed to update user status!");
                return;
            }
            toast.success("User status updated successfully!");
        } catch (error) {
            toast.error("Error while updating user status!");
        } finally {
            toast.dismiss(toggleuserStatus);
        }
    };

    // Function to show more users
    const handleShowMore = () => {
        setVisibleUsersCount((prevCount) => prevCount + 20);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Users Management</h1>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className="text-gray-800 font-semibold mb-8 text-xl text-center">Recommended Users</div>

                    {/* Search Bar */}
                    <div className="relative mb-6  text-black">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search users by name..."
                            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border-2 font-bold border-cyan-500"
                        />
                    </div>

                    {/* User List */}
                    <div className="space-y-4">
                        {filteredUsers.slice(0, visibleUsersCount).map((user: User) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center space-x-4">
                                    {user?.profileImage ? (
                                        <Image
                                            width={50}
                                            height={50}
                                            src={user?.profileImage}
                                            alt={user.firstName}
                                            className="w-14 h-14 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-blue-500 text-white flex justify-center items-center font-bold text-lg">
                                            {user?.firstName.slice(0, 1).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="text-lg font-bold text-gray-700">{`${user.firstName} ${user.lastName}`}</span>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        disabled={toggleBlockedLoading || toggleVerifiedAndRecommendedLoading}
                                        className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        onClick={() => handleAddRecommended(user.id)}
                                    >
                                        Remove from Recommended User
                                    </button>
                                    <button
                                        disabled={toggleBlockedLoading || toggleVerifiedAndRecommendedLoading}
                                        className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                                        onClick={() => handleBlockUser(user.id)}
                                    >
                                        Block User
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Show More Button */}
                    {visibleUsersCount < filteredUsers.length && (
                        <div className="text-center mt-6">
                            <button
                                className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                onClick={handleShowMore}
                            >
                                Show More
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecommendedUserPage;
