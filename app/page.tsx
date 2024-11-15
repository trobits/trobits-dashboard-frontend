"use client";
import { LockIcon, UserIcon } from "lucide-react";
import { useLoginUserMutation } from "@/redux/features/api/authApi";
import toast from "react-hot-toast";
import { setUser } from "@/redux/features/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const [ loginUserMutationFn, { isLoading: userSignInLoading } ] = useLoginUserMutation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = e.currentTarget;

    try {
      const result = await loginUserMutationFn({
        email: email.value,
        password: password.value,
      }).unwrap();
      console.log(result)

      if (result?.error) {
        toast.error(result.error.response?.data?.message || "Login failed");
        return;
      }
      dispatch(setUser({ user: result.data }));
      router.push("/dashboard");
      localStorage.setItem("token", result.token.accessToken);
      toast.success("Successfully logged in.");
    } catch (error) {
      toast.error("Failed to login");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-gray-900 to-black p-6 sm:p-12">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 bg-opacity-60 rounded-2xl shadow-2xl backdrop-blur-lg p-8 space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-white">Admin Login</h2>
            <p className="mt-2 text-sm text-gray-300">
              Enter your credentials to access the admin panel
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="pl-10 bg-gray-700 bg-opacity-30 text-white rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full py-3"
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="pl-10 bg-gray-700 bg-opacity-30 text-white rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full py-3"
                    placeholder="Password"
                  />
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={userSignInLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition hover:scale-105 active:scale-95"
              >
                <Link href="/dashboard">
                {userSignInLoading ? "Signing in..." : "Sign in"}
                </Link>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
