"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function RegisterClient() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await signUp.email({
      email,
      password,
      name,
      role: "admin", // Hardcoded to admin
      fetchOptions: {
        onSuccess: (ctx: any) => {
          const role = ctx.data?.user?.role;
          if (role === "admin") {
            router.push("/admin");
          } else {
            router.push("/profile");
          }
        },
        onError: (ctx: any) => {
          setError(ctx.error.message || "An error occurred");
          setLoading(false);
        },
      },
    } as any);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] font-sans p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[380px] bg-white p-5 sm:p-8 rounded-2xl border border-gray-200 shadow-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Image
              src="/sf-logo.png"
              alt="SiliconFriends Logo"
              width={48}
              height={48}
              className="w-12 h-12 object-cover rounded-xl shadow-sm"
            />
            <span className="text-2xl font-bold text-gray-900 tracking-tight">SiliconFriends</span>
          </div>
          <h1 className="text-[15px] font-medium text-gray-500">
            Create your account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200 text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-800">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-md p-2.5 text-gray-900 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none transition-shadow text-base sm:text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-800">
              Email address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-md p-2.5 text-gray-900 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none transition-shadow text-base sm:text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-800">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-md p-2.5 text-gray-900 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none transition-shadow text-base sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full bg-[#2563EB] hover:bg-[#172554] text-white font-medium py-2.5 rounded-md transition-colors text-sm flex items-center justify-center ${loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Register User"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-gray-900 hover:underline">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
