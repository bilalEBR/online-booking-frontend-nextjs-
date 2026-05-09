
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react"; // Added for notification
import { 
  Users, Bed, UserCog, History, ClipboardList, LogOut, CheckCircle 
} from "lucide-react";

interface SidebarProps {
  role: "MANAGER" | "RECEPTIONIST";
}



export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  
   const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  
  const managerLinks = [
    { name: "Guest Management", href: "/admin/guests", icon: Users },
    { name: "Room Management", href: "/admin/rooms", icon: Bed },
    { name: "Staff Management", href: "/admin/staff", icon: UserCog },
    { name: "Booking History", href: "/admin/bookings", icon: History },
  ];

  const receptionistLinks = [
    { name: "Manage Bookings", href: "/reception/bookings", icon: ClipboardList },
  ];

  const links = role === "MANAGER" ? managerLinks : receptionistLinks;

  // 2. UPDATED LOGOUT WITH NOTIFICATION & DELAY
  const handleLogout = () => {
    // Trigger notification
     setNotification({ msg: "Logging out... See you soon!", type: 'success' });

    // Wait 1.5 seconds for the user to see the message
    setTimeout(() => {
      localStorage.clear();
      setNotification(null);
      router.push("/");
      router.refresh();
    }, 1500);
  };

  return (
    <>
      {/* 3. NOTIFICATION OVERLAY (HIGH Z-INDEX) */}
       {notification && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold animate-in slide-in-from-right duration-300 ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          <CheckCircle size={20} />
          <span>{notification.msg}</span>
        </div>
      )}

      <div className="w-64 bg-blue-950 text-white h-screen sticky top-0 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Bed className="text-blue-400" /> Grand Semen
          </h1>
          <p className="text-[10px] text-white mt-1 opacity-70 uppercase font-black tracking-widest bg-blue-900/50 px-2 py-0.5 rounded-full w-fit">
            {role} Workspace
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive ? "bg-blue-600 text-white shadow-lg" : "hover:bg-blue-900 text-blue-100"
                }`}
              >
                <Icon size={20} />
                <span className="font-bold text-sm">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-900">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-black text-xs uppercase tracking-widest group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}