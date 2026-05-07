"use client";
import { LayoutDashboard, Users, Bed, CalendarCheck } from "lucide-react";

export default function AdminDashboard() {
  // These would eventually come from your API
  const stats = [
    { name: "Total Rooms", value: "12", icon: Bed, color: "text-blue-600" },
    { name: "Total Guests", value: "45", icon: Users, color: "text-purple-600" },
    { name: "Pending Bookings", value: "8", icon: CalendarCheck, color: "text-orange-600" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manager Overview</h1>
        {/* <p className="text-gray-500">Welcome back! Here is what's happening today.</p> */}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-4 rounded-2xl bg-gray-50 ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for a chart or recent activity */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent System Activity</h2>
        <div className="space-y-4">
          <p className="text-gray-400 italic">No recent logs to display.</p>
        </div>
      </div>
    </div>
  );
}