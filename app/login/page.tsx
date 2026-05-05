"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Navbar from "../components/Navbar";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: any) => {
    console.log("Login Attempt:", data);
    alert("Login simulation successful!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-24 px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
          <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500 mb-8">Please enter your details to sign in.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <input {...register("email")} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none" placeholder="john@example.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input type="password" {...register("password")} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none" placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
            </div>

            <button type="submit" className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-100">
              Sign In
            </button>
          </form>

          <p className="text-center text-gray-600 mt-8">
            Don't have an account? <Link href="/register" className="text-blue-900 font-bold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}