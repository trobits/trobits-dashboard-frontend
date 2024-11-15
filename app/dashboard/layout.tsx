

"use client";
import { Button } from '@/components/ui/button';
import { useLazyLogoutQuery } from '@/redux/features/api/authApi';
import { logout } from '@/redux/features/slices/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FiMenu } from 'react-icons/fi';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [ triggerLogout, { isLoading } ] = useLazyLogoutQuery();
    const [ isSidebarOpen, setIsSidebarOpen ] = useState(false);

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
        const token = localStorage.getItem('token');
        if (!token) router.push('/');
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
                            <Link href="/dashboard/allblogs" passHref>
                                <Button
                                    className={`w-full justify-start text-left px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors ${pathname === '/dashboard/allblogs' ? 'bg-teal-700 text-white' : 'bg-gray-800 text-gray-300'
                                        }`}
                                    onClick={handleMenuItemClick}
                                >
                                    Show All Blogs
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
                            <Link href="/dashboard/allSubscriber" passHref>
                                <Button
                                    className={`w-full justify-start text-left px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors ${pathname === '/dashboard/addblog' ? 'bg-teal-700 text-white' : 'bg-gray-800 text-gray-300'
                                        }`}
                                    onClick={handleMenuItemClick}
                                >
                                    All Subscriber
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
            <main className={`flex-1 h-full overflow-y-auto lg:ml-4 p-10 bg-white shadow-inner rounded-lg transition-all duration-300`}>
                <h1 className="text-4xl font-bold text-teal-700 mb-6">Blog Dashboard</h1>
                {children}
            </main>
        </div>
    );
};

export default Layout;
