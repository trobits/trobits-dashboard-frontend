/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Loading from "@/components/shared/Loading";
import { useGetAllSubscriberQuery } from "@/redux/features/api/blogApi";

// Define a type for the subscriber
interface Subscriber {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

const AllSubscriberPage = () => {
    const { data, isLoading } = useGetAllSubscriberQuery("");

    if (isLoading) {
        return <Loading />;
    }

    // Type check data and filter out invalid entries (e.g., empty email)
    const subscribers: Subscriber[] = data?.data?.filter((subscriber: Subscriber) => subscriber?.email) || [];

    return (
        <div className="container mx-auto px-4 pt-2 pb-6">
            <h2 className="text-2xl font-bold mb-4">Subscribers</h2>
            <div className="overflow-auto h-[600px] ">
                <table className="min-w-full  bg-white shadow-md rounded-lg overflow-y-auto">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-2 px-4 text-left">Email</th>
                            <th className="py-2 px-4 text-left">Subscribed At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscribers.length > 0 ? (
                            subscribers.map((subscriber: Subscriber) => (
                                <tr key={subscriber?.id} className="bg-gray-700 text-white border-b border-gray-600 hover:bg-gray-600 transition-colors">
                                    <td className="py-2 px-4">{subscriber?.email}</td>
                                    <td className="py-2 px-4">{new Date(subscriber?.createdAt).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2} className="py-2 px-4 text-center">No subscribers found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllSubscriberPage;
