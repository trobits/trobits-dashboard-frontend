// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client"
// import Image from 'next/image';
// import React, { useState } from 'react';
// import { User } from '../layout';
// import { useGetAllBlockedUsersQuery, useToggleBlockedMutation } from '@/redux/features/api/authApi';
// import Loading from '@/components/shared/Loading';
// import toast from 'react-hot-toast';

// const BlockedUsersPage = () => {
//     const { data: allUsersData, isLoading: allUsersDataLoading } = useGetAllBlockedUsersQuery("");
//     const [ toggleBlockedMutation, { isLoading: toggleBlockedLoading } ] = useToggleBlockedMutation();
//     const [ visibleUsersCount, setVisibleUsersCount ] = useState(20);

//     if (allUsersDataLoading) {
//         return <Loading />;
//     }



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

//     const handleShowMore = () => {
//         setVisibleUsersCount((prevCount) => prevCount + 20);
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-blue-100 p-6">
//             <div className="max-w-6xl mx-auto">
//                 <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
//                     Users Management
//                 </h1>
//                 <div className="bg-white shadow-lg rounded-xl p-6">
//                     <div className="text-gray-800 font-semibold mb-10 text-2xl text-center">
//                         Blocked Users
//                     </div>
//                     <div className="space-y-6">
//                         {users.slice(0, visibleUsersCount).map((user: User) => (
//                             <div
//                                 key={user.id}
//                                 className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow hover:shadow-lg transition-shadow"
//                             >
//                                 <div className="flex items-center space-x-4">
//                                     {user?.profileImage ? (
//                                         <Image
//                                             width={60}
//                                             height={60}
//                                             src={user?.profileImage}
//                                             alt={user.firstName}
//                                             className="w-14 h-14 rounded-full object-cover"
//                                         />
//                                     ) : (
//                                         <div className="w-14 h-14 rounded-full bg-purple-500 text-white flex justify-center items-center font-bold text-lg">
//                                             {user?.firstName.slice(0, 1).toUpperCase()}
//                                         </div>
//                                     )}
//                                     <span className="text-lg font-semibold text-gray-700">
//                                         {`${user.firstName} ${user.lastName}`}
//                                     </span>
//                                 </div>
//                                 <div className="flex space-x-4">
//                                     {/* <button
//                                         className="px-4 py-2 bg-teal-500 text-white font-medium rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
//                                         onClick={() => handleAddRecommended(user.id)}
//                                     >
//                                         Add as Recommended
//                                     </button> */}
//                                     <button
//                                         className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
//                                         onClick={() => handleBlockUser(user.id)}
//                                     >
//                                         Unblock User
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                     {visibleUsersCount < users.length && (
//                         <div className="text-center mt-6">
//                             <button
//                                 className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg shadow hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 transition"
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

// export default BlockedUsersPage;









/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { User } from "../layout";
import { useGetAllBlockedUsersQuery, useToggleBlockedMutation } from "@/redux/features/api/authApi";
import Loading from "@/components/shared/Loading";
import toast from "react-hot-toast";
import { debounce } from "lodash";

const BlockedUsersPage = () => {
    const { data: allUsersData, isLoading: allUsersDataLoading } = useGetAllBlockedUsersQuery("");
    const [ toggleBlockedMutation, { isLoading: toggleBlockedLoading } ] = useToggleBlockedMutation();
    const [ visibleUsersCount, setVisibleUsersCount ] = useState(20);
    const [ searchTerm, setSearchTerm ] = useState<string>("");
    const [ filteredUsers, setFilteredUsers ] = useState<User[]>([]);


    const users: User[] = useMemo(() => allUsersData?.data || [], [ allUsersData?.data ]);

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

    const handleShowMore = () => {
        setVisibleUsersCount((prevCount) => prevCount + 20);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-blue-100 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Users Management</h1>
                <div className="bg-white shadow-lg rounded-xl p-6">
                    <div className="text-gray-800 font-semibold mb-10 text-2xl text-center">Blocked Users</div>

                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search users by name..."
                            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 border-2 border-cyan-500 font-bold text-black"
                        />
                    </div>

                    {/* User List */}
                    <div className="space-y-6">
                        {filteredUsers.slice(0, visibleUsersCount).map((user: User) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center space-x-4">
                                    {user?.profileImage ? (
                                        <Image
                                            width={60}
                                            height={60}
                                            src={user?.profileImage}
                                            alt={user.firstName}
                                            className="w-14 h-14 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-purple-500 text-white flex justify-center items-center font-bold text-lg">
                                            {user?.firstName.slice(0, 1).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="text-lg font-semibold text-gray-700">
                                        {`${user.firstName} ${user.lastName}`}
                                    </span>
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        disabled={toggleBlockedLoading}
                                        className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                                        onClick={() => handleBlockUser(user.id)}
                                    >
                                        Unblock User
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Show More Button */}
                    {visibleUsersCount < filteredUsers.length && (
                        <div className="text-center mt-6">
                            <button
                                className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg shadow hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 transition"
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

export default BlockedUsersPage;
