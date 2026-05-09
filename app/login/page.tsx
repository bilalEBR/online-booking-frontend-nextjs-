

"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { userService } from "../../services/userService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const showNotify = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    if (type === 'error') setTimeout(() => setNotification(null), 4000);
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await userService.login(data); 
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response));

      showNotify(`Welcome back, ${response.fullName}!`, "success");

      const userRole = response.role;
      setTimeout(() => {
        if (userRole === "MANAGER") router.push("/admin/guests");
        else if (userRole === "RECEPTIONIST") router.push("/reception/bookings");
        else router.push("/");
        router.refresh(); 
      }, 1500);

    } catch (err: any) {
      showNotify(err.message || "Invalid email or password", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative flex items-center justify-center px-4">
      
      {/* NOTIFICATION OVERLAY */}
      {notification && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold animate-in slide-in-from-right duration-300 ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <span>{notification.msg}</span>
        </div>
      )}

      <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-xl w-full max-w-md border border-gray-100 relative">
        
        {/* BACK TO HOME ICON BUTTON */}
        <Link 
          href="/" 
          className="group flex items-center gap-2  text-blue-900 mb-8 w-fit"
        >
          <div className="p-2 bg-gray-50 group-hover:bg-blue-50 rounded-xl transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Home</span>
        </Link>

        <h1 className="text-3xl font-black text-blue-900 mb-2 tracking-tight text-center">Welcome Back</h1>
        <br></br>
        {/* <p className="text-gray-500 mb-8 font-medium">Please enter your credentials to continue.</p> */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Email Address</label>
            <input 
              {...register("email")} 
              className={`w-full p-4 bg-gray-50 border rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none transition-all ${errors.email ? 'border-red-300' : 'border-gray-100'}`} 
              placeholder="john@example.com" 
            />
            {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold italic ml-1">{errors.email.message as string}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Password</label>
            <input 
              type="password" 
              {...register("password")} 
              className={`w-full p-4 bg-gray-50 border rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none transition-all ${errors.password ? 'border-red-300' : 'border-gray-100'}`} 
              placeholder="••••••••" 
            />
            {errors.password && <p className="text-red-500 text-[10px] mt-1 font-bold italic ml-1">{errors.password.message as string}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black text-sm hover:bg-blue-800 transition-all shadow-xl shadow-blue-100 disabled:bg-gray-300 disabled:shadow-none"
          >
            {isSubmitting ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-8 text-sm font-medium">
          New here? <Link href="/register" className="text-blue-900 font-black hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}