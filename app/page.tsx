"use client";
import { useEffect, useState } from "react";
import { Room } from "./models/types";
import { roomService } from "./services/roomService";
import Navbar from "./components/Navbar";
import RoomFilters from "./components/RoomFilters";
import { ArrowRight, User, Users } from "lucide-react";
import router from "next/dist/shared/lib/router/router";
import { useRouter } from "next/navigation";
import Footer from "./components/Footer";

export default function HomePage() {
  const router = useRouter();

  const handleBookNow = (roomId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      // If no token, send to register
      // alert("Please create an account or login to book a room.");
      // router.push("/register");

      setShowAuthModal(true);
    } else {
      // If token exists, proceed to payment
      router.push(`/bookings/new?roomId=${roomId}`);
    }
  };

  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    roomService
      .getAllRooms()
      .then((data) => {
        setRooms(data);
        setFilteredRooms(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFilter = (filters: any) => {
    let result = [...rooms];
    if (filters.search) {
      result = result.filter(
        (r) =>
          r.roomNumber.includes(filters.search) ||
          r.description.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }
    if (filters.type)
      result = result.filter((r) => r.roomType === filters.type);
    if (filters.maxPrice)
      result = result.filter(
        (r) => r.pricePerNight <= Number(filters.maxPrice),
      );
    setFilteredRooms(result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <header className="bg-blue-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Find Your Perfect Stay
          </h1>
          <p className="text-blue-100 text-lg opacity-90">
            Luxury rooms starting from 300 ETB
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4">
        {/* AUTHENTICATION PROMPT MODAL */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] w-full max-w-sm p-8 shadow-2xl border border-gray-100 animate-in zoom-in duration-200">
              {/* Icon & Title */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mb-4">
                  <User size={32} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
                  Login Required
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  To finalize your reservation and secure this room, you need to
                  be logged into your account.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push("/register")}
                  className="w-full bg-blue-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-blue-800 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                >
                  <span>Proceed to Register</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => setShowAuthModal(false)}
                  className="w-full py-4 text-gray-400 font-bold text-sm hover:bg-gray-50 rounded-2xl transition-all"
                >
                  Stay as Guest
                </button>
              </div>

              {/* Mini Link for existing users */}
              <p className="text-center mt-6 text-xs text-gray-400 font-medium">
                Already have an account?
                <button
                  onClick={() => router.push("/login")}
                  className="text-blue-900 font-black ml-1 hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        )}

        <RoomFilters onFilterChange={handleFilter} />

        {loading ? (
          <div className="text-center py-20 text-gray-500 animate-pulse">
            Searching for available rooms...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">


           {filteredRooms.map((room) => {
  // 1. LOGIC: Determine if the room is currently unavailable
  const isOccupied = room.status === "OCCUPIED" || room.status === "MAINTENANCE";

  return (
    <div
      key={room.id}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 ${
        isOccupied ? "opacity-90" : ""
      }`}
    >
      {/* Image Area */}
      <div className="h-48 bg-slate-100 relative overflow-hidden group">
        <img
          src="/download.webp"
          alt="Room Preview"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            isOccupied ? "grayscale-[0.3]" : ""
          }`}
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* ROOM TYPE BADGE (Left) */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-blue-900 shadow-sm z-10">
          {room.roomType}
        </div>

        {/* NEW: STATUS BADGE (Right) */}
        <div 
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm z-10 ${
            isOccupied 
              ? "bg-red-600 text-white" 
              : "bg-green-500 text-white"
          }`}
        >
          {room.status === "OCCUPIED" ? "TAKEN" : room.status}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">
            Room {room.roomNumber}
          </h3>

          <div className="text-right">
            <p className="text-2xl font-black text-blue-900 leading-none">
              {room.pricePerNight} <span className="text-xs">ETB</span>
            </p>
            <p className="text-[12px] text-green-600 font-bold uppercase tracking-tighter mt-1">
              ≈ ${room.priceUsd} USD
            </p>
            <p className="text-gray-400 text-[10px] uppercase font-bold">
              per night
            </p>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-1">
          {room.description}
        </p>

        {/* Footer: Capacity on left, Button on bottom-right */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1 text-gray-900 text-sm">
            <Users size={16} />
            <span>{room.capacity} Guests</span>
          </div>

          {/* UPDATED BUTTON LOGIC */}
          <button
            onClick={() => !isOccupied && handleBookNow(room.id)}
            disabled={isOccupied}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
              isOccupied
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                : "bg-blue-900 text-white hover:bg-blue-800 shadow-blue-100"
            }`}
          >
            {isOccupied ? (room.status === "MAINTENANCE" ? "Maintenance" : "Occupied") : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
})}
            
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
