"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Users, Bed, UserCog, History, ClipboardList, LogOut, LayoutDashboard 
} from "lucide-react";

interface SidebarProps {
  role: "MANAGER" | "RECEPTIONIST";
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const managerLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Guest Management", href: "/admin/guests", icon: Users },
    { name: "Room Management", href: "/admin/rooms", icon: Bed },
    { name: "Staff Management", href: "/admin/staff", icon: UserCog },
    { name: "Booking History", href: "/admin/bookings", icon: History },
  ];

  const receptionistLinks = [
    { name: "Dashboard", href: "/reception", icon: LayoutDashboard },
    { name: "Manage Bookings", href: "/reception/bookings", icon: ClipboardList },
  ];

  const links = role === "MANAGER" ? managerLinks : receptionistLinks;

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="w-64 bg-blue-950 text-white h-screen sticky top-0 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Bed className="text-blue-400" /> Grand Hayle Hotel
        </h1>
        <p className="text-xs text-white mt-1 opacity-70 uppercase tracking-widest">
          {role}
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
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-blue-900">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-950/30 rounded-xl transition-colors font-bold"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}