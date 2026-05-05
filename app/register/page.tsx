"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userService } from "../services/userService";
import Navbar from "../components/Navbar";

const registerSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      await userService.register(data);
      alert("Registration Successful! Please Login.");
      router.push("/login");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-20 px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
          <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Create Account</h1>
          <p className="text-gray-500 mb-8">Join us to start booking your stay.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
              <input {...register("fullName")} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none" placeholder="John Doe" />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <input {...register("email")} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none" placeholder="john@example.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
              <input {...register("phone")} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none" placeholder="0123456789" />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input type="password" {...register("password")} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none" placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-100 disabled:bg-gray-400">
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-8">
            Already have an account? <Link href="/login" className="text-blue-900 font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}