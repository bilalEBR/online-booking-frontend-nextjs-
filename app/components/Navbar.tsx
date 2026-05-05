"use client";
import Link from "next/link";
import { Hotel, User, LogIn } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <Hotel size={28} />
            <span>GrandReserve</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <Link href="/my-bookings" className="hover:text-blue-600 transition">My Bookings</Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 px-3 py-2 transition">
              <LogIn size={18} />
              <span>Login</span>
            </Link>
            <Link href="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition flex items-center gap-2">
              <User size={18} />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}