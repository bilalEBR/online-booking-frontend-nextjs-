"use client";
import Navbar from "../components/Navbar";
import { CalendarDays, PackageOpen } from "lucide-react";
import Link from "next/link";

export default function MyBookingsPage() {
  // Placeholder for user bookings
  const bookings = []; 

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="flex items-center gap-3 mb-8">
          <CalendarDays className="text-blue-900" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200 shadow-sm">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageOpen className="text-blue-600" size={40} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No bookings found</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              You haven't made any reservations yet. Explore our rooms and plan your next stay!
            </p>
            <Link href="/">
              <button className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all">
                Browse Rooms
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Real bookings will be mapped here later */}
          </div>
        )}
      </div>
    </div>
  );
}