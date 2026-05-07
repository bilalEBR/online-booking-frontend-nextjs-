"use client";
import { useEffect, useState } from "react";
import { Room } from "./models/types";
import { roomService } from "./services/roomService";
import Navbar from "./components/Navbar";
import RoomFilters from "./components/RoomFilters";
import { Users } from "lucide-react";
import router from "next/dist/shared/lib/router/router";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter(); 

   const handleBookNow = (roomId: number) => {
     
  const token = localStorage.getItem("token");

  if (!token) {
    // If no token, send to register
    alert("Please create an account or login to book a room.");
    router.push("/register");
  } else {
    // If token exists, proceed to payment
    router.push(`/bookings/new?roomId=${roomId}`);
  }
};

  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    roomService.getAllRooms()
      .then((data) => {
        setRooms(data);
        setFilteredRooms(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFilter = (filters: any) => {
    let result = [...rooms];
    if (filters.search) {
      result = result.filter(r => 
        r.roomNumber.includes(filters.search) || 
        r.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.type) result = result.filter(r => r.roomType === filters.type);
    if (filters.maxPrice) result = result.filter(r => r.pricePerNight <= Number(filters.maxPrice));
    setFilteredRooms(result);
  };

 
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <header className="bg-blue-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">Find Your Perfect Stay</h1>
          <p className="text-blue-100 text-lg opacity-90">Luxury rooms starting from $50</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4">
        <RoomFilters onFilterChange={handleFilter} />

        {loading ? (
          <div className="text-center py-20 text-gray-500 animate-pulse">Searching for available rooms...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => (
              <div key={room.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
                {/* Image Area */}
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                   <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">Room Preview</div>
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-900 shadow-sm">
                     {room.roomType}
                   </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">Room {room.roomNumber}</h3>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-900">${room.pricePerNight}</p>
                      <p className="text-gray-400 text-[10px] uppercase font-bold">per night</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-1">
                    {room.description}
                  </p>
                  
                  {/* Footer: Capacity on left, Button on bottom-right */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Users size={16} />
                      <span>{room.capacity} Guests</span>
                    </div>
                    
                   <button 
  onClick={() => handleBookNow(room.id)}
  className="bg-blue-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-800 transition-all shadow-md shadow-blue-100"
>
  Book Now
</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}