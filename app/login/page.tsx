"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Navbar from "../components/Navbar"; // Ensure this path is correct
import { userService } from "../services/userService";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter(); // <--- Added initialization
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

// Inside src/app/login/page.tsx

const onSubmit = async (data: any) => {
  try {
    const response = await userService.login(data); 
    
    // 1. Save data to storage
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response));

    // 2. Role-Based Redirection Logic
    const userRole = response.role; // This comes from your Spring Boot Enum (MANAGER, RECEPTIONIST, GUEST)

    if (userRole === "MANAGER") {
      router.push("/admin"); // Redirects to Manager Dashboard
    } else if (userRole === "RECEPTIONIST") {
      router.push("/reception"); // Redirects to Reception Dashboard
    } else {
      router.push("/"); // Guests go to the public home page
    }

    // 3. Refresh to update the Navbar state
    router.refresh(); 

  } catch (err: any) {
    alert("Login failed: " + err.message);
  }
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
              <input 
                {...register("email")} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none" 
                placeholder="john@example.com" 
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                {...register("password")} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none" 
                placeholder="••••••••" 
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-100 disabled:bg-gray-400"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
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