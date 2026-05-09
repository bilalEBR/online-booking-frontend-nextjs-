
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userService } from "../services/userService";
import { useState } from "react";
import { CheckCircle, AlertTriangle, ArrowLeft, User, Mail, Phone, Lock } from "lucide-react";

const registerSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const showNotify = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    if (type === 'error') setTimeout(() => setNotification(null), 4000);
  };

  const onSubmit = async (data: any) => {
    try {
      await userService.register(data);
      
      showNotify("Account created successfully! Redirecting to login...", "success");

      // Wait 1.5 seconds so the user sees the success notification
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err: any) {
      showNotify(err.message || "Registration failed. Email may already be in use.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative flex items-center justify-center py-12 px-4">
      
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
          className="group flex items-center gap-2 text-blue-900 mb-8 w-fit"
        >
          <div className="p-2 bg-gray-50 group-hover:bg-blue-50 rounded-xl transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Home</span>
        </Link>

        <h1 className="text-3xl font-black text-blue-900 mb-2 tracking-tight text-center">Create Account</h1>
        {/* <p className="text-gray-500 text-center mb-8 text-sm font-medium">Join us to start booking your stay.</p> */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                {...register("fullName")} 
              autoComplete="off"
                className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none transition-all ${errors.fullName ? 'border-red-300' : 'border-gray-100'}`} 
                placeholder="John Doe" 
              />
            </div>
            {errors.fullName && <p className="text-red-500 text-[10px] mt-1 font-bold italic ml-1">{errors.fullName.message as string}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                {...register("email")} 
                autoComplete="off"
                className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none transition-all ${errors.email ? 'border-red-300' : 'border-gray-100'}`} 
                placeholder="john@example.com" 
              />
            </div>
            {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold italic ml-1">{errors.email.message as string}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                {...register("phone")} 
                className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none transition-all ${errors.phone ? 'border-red-300' : 'border-gray-100'}`} 
                placeholder="0123456789" 
              />
            </div>
            {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-bold italic ml-1">{errors.phone.message as string}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Security Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                {...register("password")} 
                autoComplete="off"
                className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none transition-all ${errors.password ? 'border-red-300' : 'border-gray-100'}`} 
                placeholder="••••••••" 
              />
            </div>
            {errors.password && <p className="text-red-500 text-[10px] mt-1 font-bold italic ml-1">{errors.password.message as string}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black text-sm hover:bg-blue-800 transition-all shadow-xl shadow-blue-100 disabled:bg-gray-300 disabled:shadow-none mt-4"
          >
            {isSubmitting ? "Creating Account..." : "Register Now"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-8 text-sm font-medium">
          Already have an account? <Link href="/login" className="text-blue-900 font-black hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}