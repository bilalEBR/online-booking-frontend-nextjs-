
"use client";
import Link from "next/link";
import { Hotel, User, LogIn, LogOut, CheckCircle } from "lucide-react"; // Added CheckCircle
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      const user = JSON.parse(userStr);
      setIsLoggedIn(true);
      setUserRole(user.role);
    }
  }, []);

  const getHomeLink = () => {
    if (userRole === "MANAGER") return "/admin/guests";
    if (userRole === "RECEPTIONIST") return "/reception/bookings";
    return "/";
  };

  // 2. UPDATED LOGOUT WITH NOTIFICATION
  // const handleLogout = () => {
  //   // Show notification first
  //   setNotification({ msg: "Successfully logged out. See you soon!", type: 'success' });

  //   // Wait 1.5 seconds so the user can see the message
  //   setTimeout(() => {
  //     localStorage.removeItem("token");
  //     localStorage.removeItem("user");
  //     setIsLoggedIn(false);
  //     setNotification(null);
  //     router.push("/");
  //     router.refresh();
  //   }, 1500);
  // };

  // Inside Navbar.tsx

const handleLogout = () => {
  // 1. Show the notification while the user is still "logged in"
  setNotification({ msg: "Logging out... See you soon!", type: 'success' });
  console.log("Notification triggered"); // Check your browser console

  // 2. Wait for 2 seconds (gives time for the animation)
  setTimeout(() => {
    // 3. Clear storage ONLY after the wait
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // 4. Update local state
    setIsLoggedIn(false);
    setNotification(null);

    // 5. Redirect
    router.push("/");
    router.refresh();
  }, 2000);
};

  return (
    <>
      {/* 3. NOTIFICATION UI COMPONENT */}
      {notification && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold animate-in slide-in-from-right duration-300 ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          <CheckCircle size={20} />
          <span>{notification.msg}</span>
        </div>
      )}

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href={getHomeLink()} className="flex items-center gap-2 text-blue-900 font-black text-xl tracking-tight">
              <Hotel size={28} className="text-blue-600" />
              <span>Grand Semen Hotel</span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8 text-gray-500 font-bold text-sm uppercase tracking-widest">
              <Link href="/" className="hover:text-blue-900 transition-colors">Home</Link>
              <Link href="/my-bookings" className="hover:text-blue-900 transition-colors">My Bookings</Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 font-black text-xs uppercase tracking-widest hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              ) : (
                <>
                  <Link href="/login" className="flex items-center gap-1 text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-blue-900 px-3 py-2 transition-all">
                    <LogIn size={18} />
                    <span>Login</span>
                  </Link>
                  <Link href="/register" className="bg-blue-900 text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-blue-100 flex items-center gap-2">
                    <User size={18} />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}