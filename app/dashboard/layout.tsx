/* eslint-disable @typescript-eslint/no-unused-vars */


"use client";
import { Button } from '@/components/ui/button';
import { useLazyGetUserByIdQuery, useLazyLogoutQuery } from '@/redux/features/api/authApi';
import { logout, setUser } from '@/redux/features/slices/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import { jwtDecode } from "jwt-decode";
import toast from 'react-hot-toast';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string;
    isDeleted: boolean;
    posts: Post[];
    coverImage: string;
    role: "USER" | "ADMIN";
    followers: string[];
    following: string[];
    comments: Comment[];
    createdAt: string;
    updatedAt: string;
}

export interface Post {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    image?: string;
    video?: string;
    likeCount: number;
    likers: string[];
    topicId?: string | null;
    category: "IMAGE" | "VIDEO";
    comments: Comment[];
}

export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    postId?: string;
    articleId?: string | null;
    likers: string[];
    dislikers: string[];
    likeCount: number;
    dislikeCount: number;
}

export interface Article {
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string;
    likeCount: number;
    likers: string[];
    comments: Comment[];
}



const Layout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [ triggerLogout, { isLoading } ] = useLazyLogoutQuery();
    const [ isSidebarOpen, setIsSidebarOpen ] = useState(false);
    const [ triggerGetUserById, { isLoading: getUserByIdLoading } ] = useLazyGetUserByIdQuery()

    const handleLogOut = async () => {
        try {
            await triggerLogout({});
            dispatch(logout());
            localStorage.removeItem('token');
            router.push('/');
        } catch (error) {
            console.error("Logout failed: ", error);
        }
    };

    useEffect(() => {
        const verifyUser = async () => {

            try {
                const token = localStorage.getItem('token');

                if (!token) router.push('/');
                const decodedInformation: Partial<User> = jwtDecode(token as string)
                const response = await triggerGetUserById(decodedInformation.id).unwrap()
                const currentUser: User = response?.data
                if (currentUser?.role !== "ADMIN") {
                    dispatch(logout());
                    router.push("/");
                    toast.error("You don't have admin rights.")
                }
                dispatch(setUser({ user: currentUser }))
            } catch (error) {
                router.push("/")
                toast.error("Login with valid information.")
            }
        }
        verifyUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMenuItemClick = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="h-dvh overflow-hidden flex flex-col lg:flex-row bg-white">
            {/* Sidebar */}
            <aside
                className={`lg:w-64 w-64 h-full overflow-y-auto bg-gray-900 text-gray-200 flex flex-col shadow-lg fixed lg:relative z-20 lg:translate-x-0 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-700 rounded-t-lg">
                    <h2 className="text-lg font-bold">Admin Dashboard</h2>
                    {/* Close button for mobile */}
                    <Button
                        className="lg:hidden text-white bg-red-500 px-4"
                        variant="ghost"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        ✕
                    </Button>
                </div>
                <nav className="w-full p-4">
                    <ul className="space-y-4">
                        <li>
                            <Link href="/dashboard/shiblunc" passHref>
                                <Button
                                    className={`w-full justify-start text-left px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors ${pathname === '/dashboard/shiblunc' ? 'bg-teal-700 text-white' : 'bg-gray-800 text-gray-300'
                                        }`}
                                    onClick={handleMenuItemClick}
                                >
                                    Shib & Lunc
                                </Button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/allblogs" passHref>
                                <Button
                                    className={`w-full justify-start text-left px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors ${pathname === '/dashboard/allblogs' ? 'bg-teal-700 text-white' : 'bg-gray-800 text-gray-300'
                                        }`}
                                    onClick={handleMenuItemClick}
                                >
                                    All Blogs
                                </Button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/addblog" passHref>
                                <Button
                                    className={`w-full justify-start text-left px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors ${pathname === '/dashboard/addblog' ? 'bg-teal-700 text-white' : 'bg-gray-800 text-gray-300'
                                        }`}
                                    onClick={handleMenuItemClick}
                                >
                                    Add Blog
                                </Button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/recommendedUsers" passHref>
                                <Button
                                    className={`w-full justify-start text-left px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors ${pathname === '/dashboard/recommendedUsers' ? 'bg-teal-700 text-white' : 'bg-gray-800 text-gray-300'
                                        }`}
                                    onClick={handleMenuItemClick}
                                >
                                    Recommended Users
                                </Button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/verifiedUsers" passHref>
                                <Button
                                    className={`w-full justify-start text-left px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors ${pathname === '/dashboard/verifiedUsers' ? 'bg-teal-700 text-white' : 'bg-gray-800 text-gray-300'
                                        }`}
                                    onClick={handleMenuItemClick}
                                >
                                    Verified Users
                                </Button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/blockedUsers" passHref>
                                <Button
                                    className={`w-full justify-start text-left px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors ${pathname === '/dashboard/blockedUsers' ? 'bg-teal-700 text-white' : 'bg-gray-800 text-gray-300'
                                        }`}
                                    onClick={handleMenuItemClick}
                                >
                                    Blocked Users
                                </Button>
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-700">
                    <Button
                        variant="destructive"
                        className="w-full justify-center text-left px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white transition-colors"
                        onClick={handleLogOut}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging out...' : 'Logout'}
                    </Button>
                </div>
            </aside>

            {/* Sidebar Toggle Button with Hamburger Icon for Mobile */}
            <div className="lg:hidden flex justify-start p-4">
                <Button
                    className="bg-teal-600 text-white rounded-lg p-2"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <FiMenu size={24} /> {/* Hamburger Icon */}
                </Button>
            </div>

            {/* Main Content */}
            <main className={`flex-1 h-full overflow-y-auto lg:ml-4 p-2 md:p-10 bg-white shadow-inner rounded-lg transition-all duration-300`}>
                <h1 className="text-4xl font-bold text-teal-700 mb-6">Blog Dashboard</h1>
                {children}
            </main>
        </div>
    );
};

export default Layout;
