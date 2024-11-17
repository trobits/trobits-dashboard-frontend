/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import Image from 'next/image';
import React, { useState } from 'react';
import { User } from '../layout';
import { useGetAllBlockedUsersQuery, useToggleBlockedMutation } from '@/redux/features/api/authApi';
import Loading from '@/components/shared/Loading';
import toast from 'react-hot-toast';

const BlockedUsersPage = () => {
    const { data: allUsersData, isLoading: allUsersDataLoading } = useGetAllBlockedUsersQuery("");
    const [ toggleBlockedMutation, { isLoading: toggleBlockedLoading } ] = useToggleBlockedMutation();
    const [ visibleUsersCount, setVisibleUsersCount ] = useState(20);

    if (allUsersDataLoading) {
        return <Loading />;
    }



    const handleBlockUser = async (userId: string) => {
        const toggleuserStatus = toast.loading("updating user status.")
        try {
            const response = await toggleBlockedMutation({ id: userId });
            if (response.error) {
                toast.error("Failed to update user status!");
                return;
            }
            toast.success("User status updated successfully!");
        } catch (error) {
            toast.error("error while updating user status!")
        } finally {
            toast.dismiss(toggleuserStatus)
        }
    };

    const users: User[] = allUsersData?.data || [];

    const handleShowMore = () => {
        setVisibleUsersCount((prevCount) => prevCount + 20);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-blue-100 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
                    Users Management
                </h1>
                <div className="bg-white shadow-lg rounded-xl p-6">
                    <div className="text-gray-800 font-semibold mb-10 text-2xl text-center">
                        Blocked Users
                    </div>
                    <div className="space-y-6">
                        {users.slice(0, visibleUsersCount).map((user: User) => (
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
                                    {/* <button
                                        className="px-4 py-2 bg-teal-500 text-white font-medium rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
                                        onClick={() => handleAddRecommended(user.id)}
                                    >
                                        Add as Recommended
                                    </button> */}
                                    <button
                                        className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                                        onClick={() => handleBlockUser(user.id)}
                                    >
                                        Unblock User
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {visibleUsersCount < users.length && (
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
