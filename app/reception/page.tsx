"use client";
import { ClipboardList, Bell } from "lucide-react";
import Link from "next/link";

export default function ReceptionDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reception Desk</h1>
        <p className="text-gray-500">Manage guest arrivals and payment verifications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Call to Action Card */}
        <div className="bg-blue-900 text-white p-8 rounded-3xl shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <ClipboardList size={40} className="text-blue-300" />
            <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold">8 PENDING</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Verify Bookings</h2>
          <p className="text-blue-100 mb-6 opacity-80">There are new booking requests waiting for payment verification.</p>
          <Link href="/reception/bookings">
            <button className="bg-white text-blue-900 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
              Go to Bookings
            </button>
          </Link>
        </div>

        {/* Notifications Placeholder */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
             <Bell className="text-gray-400" />
             <h2 className="text-xl font-bold text-gray-800">Latest Notifications</h2>
          </div>
          <p className="text-gray-400 italic text-sm">No new check-ins today.</p>
        </div>
      </div>
    </div>
  );
}