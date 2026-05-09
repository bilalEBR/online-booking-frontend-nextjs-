"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { CalendarDays, PackageOpen, Info, CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { Booking } from "@/models/types";
import { bookingService } from "@/services/bookingService";

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);

    bookingService.getBookingsByUserId(user.id, token)
      .then((data) => setBookings(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  // Helper to color code the status
  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED": return "bg-green-100 text-green-700 border-green-200";
      case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED": return <CheckCircle2 size={16} />;
      case "PENDING": return <Clock size={16} />;
      case "CANCELLED": return <XCircle size={16} />;
      default: return <Info size={16} />;
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50">Loading your stay history...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-blue-900" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          </div>
          <p className="text-gray-500 font-medium">{bookings.length} Reservations</p>
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
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                
                {/* Left Side: Room Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">Room {booking.roomNumber}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusStyle(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
                    <p><span className="font-semibold text-gray-700">Check-In:</span> {booking.checkInDate}</p>
                    <p><span className="font-semibold text-gray-700">Check-Out:</span> {booking.checkOutDate}</p>
                  </div>
                </div>

                {/* Middle Side: Price */}
                <div className="text-left md:text-right">
                  <p className="text-2xl font-black text-blue-900">{booking.totalPrice} ETB</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">Total Amount Paid</p>
                </div>

                {/* Right Side: Action (Optional) */}
                {/* <div className="pt-4 md:pt-0 border-t md:border-none w-full md:w-auto">
                   <p className="text-xs text-gray-400">Ref: {booking.transaction}</p>
                </div> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}