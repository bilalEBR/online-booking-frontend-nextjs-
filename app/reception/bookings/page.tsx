

"use client";
import { useEffect, useState, useMemo } from "react";
import { 
  ClipboardList, CheckCircle, CreditCard, XCircle, Eye, X, 
  Image as ImageIcon, User, Bed, Hash, AlertCircle, Search, Filter, Info, 
  ArrowRight
} from "lucide-react";
import { bookingService } from "@/services/bookingService";
import { Booking } from "@/models/types";
import Navbar from "@/app/components/Navbar";

export default function ReceptionBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // --- SEARCH & FILTER STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

 
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => { loadBookings(); }, []);

  const showNotify = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadBookings = async () => {
    const token = localStorage.getItem("token") || "";
    try {
      const data = await bookingService.getAllBookings(token);
      setBookings(data);
    } catch (err) {
      showNotify("Error loading reservation data", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- SEARCH & FILTER LOGIC ---
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch = b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           b.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           b.id.toString().includes(searchQuery);
      const matchesStatus = statusFilter === "" || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  const handleStatusUpdate = async (status: 'CONFIRMED' | 'CANCELLED') => {
    if (!selectedBooking) return;
    const token = localStorage.getItem("token") || "";
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    try {
      await bookingService.updateStatus(selectedBooking.id, status, user.id, token);
      showNotify(`Booking #${selectedBooking.id} is now ${status.toLowerCase()}`, "success");
      setSelectedBooking(null);
      loadBookings();
    } catch (err: any) {
      showNotify(err.message, "error");
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Notifications */}
      {notification && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold animate-in slide-in-from-right ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span>{notification.msg}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Reception Desk</h1>
          {/* <p className="text-gray-500 font-medium italic text-sm">Operation Hub: Payment Verification & Room Allocation</p> */}
        </div>
      </div>

      {/* --- SEARCH & FILTER BAR --- */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by Guest, Room, or Booking ID..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-[20px] focus:ring-2 focus:ring-blue-900 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-[20px] px-4 py-2">
          <Filter size={18} className="text-gray-400" />
          <select 
            className="bg-transparent outline-none text-gray-600 font-bold text-sm uppercase tracking-tighter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="p-20 text-center text-gray-400 animate-pulse font-bold tracking-widest uppercase text-xs">Accessing Secure Records...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white p-20 rounded-[32px] border border-dashed border-gray-200 text-center flex flex-col items-center">
             <Info className="text-gray-300 mb-4" size={48} />
             <p className="text-gray-400 font-bold">No reservations found matching your current filter.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center hover:shadow-md transition-all gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${booking.status === 'PENDING' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                  <ClipboardList size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-gray-900 text-lg">Booking #{booking.id}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                      booking.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                      booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    <span className="font-bold text-blue-900">{booking.guestName}</span> 
                    <ArrowRight className="inline mx-2 text-gray-300" size={12}/> 
                    Room {booking.roomNumber}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right mr-4 hidden md:block">
                   <p className="text-xl font-black text-blue-950 tracking-tighter">{booking.totalPrice} ETB</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Calculated Fee</p>
                </div>
                <button 
                  onClick={() => setSelectedBooking(booking)}
                  className="bg-blue-900 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-100"
                >
                  <Eye size={16} /> Verify
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- VERIFICATION MODAL --- */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-200 max-h-[90vh]">
            
            {/* Left Side: Screenshot */}
            <div className="w-full md:w-1/2 bg-slate-900 relative flex items-center justify-center border-r border-gray-100">
               <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-xl text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 z-10 border border-white/10">
                 <ImageIcon size={14} className="text-blue-400" /> Digital Receipt Image
               </div>
               <img 
                 src={`${BACKEND_URL}${selectedBooking.screenshotUrl}`} 
                 alt="Payment Proof" 
                 className="w-full h-full object-contain p-6"
                 onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400?text=Receipt+Not+Found"; }}
               />
            </div>

            {/* Right Side: Data & Actions */}
            <div className="w-full md:w-1/2 p-10 flex flex-col overflow-y-auto">
               <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-blue-950 tracking-tight">Manual Verification</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Ref: {selectedBooking.transactionNum}</p>
                  </div>
                  <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X/></button>
               </div>

               <div className="space-y-4 flex-1">
                  <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                    <p className="text-[10px] font-black text-blue-400 uppercase mb-2 flex items-center gap-1 tracking-widest">
                      <User size={12}/> Transfer Initiated By
                    </p>
                    <p className="text-xl font-black text-blue-950">{selectedBooking.senderFullName}</p>
                  </div>

                  <div className="p-6 bg-green-50/50 rounded-3xl border border-green-100">
                    <p className="text-[10px] font-black text-green-600 uppercase mb-2 flex items-center gap-1 tracking-widest">
                      <CreditCard size={12}/> Verified Amount Due
                    </p>
                    <div className="flex items-baseline gap-1">
                       <span className="text-4xl font-black text-green-700 tracking-tighter">{selectedBooking.totalPrice}</span>
                       <span className="text-xs text-green-600 font-black">ETB</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-gray-50 rounded-[24px] border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-1 tracking-widest">Bank Reference</p>
                      <p className="font-bold text-gray-800 text-sm truncate">{selectedBooking.transactionNum}</p>
                    </div>
                    <div className="p-5 bg-gray-50 rounded-[24px] border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-1 tracking-widest">Allocated Room</p>
                      <p className="font-bold text-gray-800 text-sm">Room {selectedBooking.roomNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-[11px] text-amber-700 leading-tight">
                     <AlertCircle size={20} className="shrink-0" />
                     <p><b>Audit Requirement:</b> Ensure the sender name and reference ID match your bank portal data before confirming.</p>
                  </div>
               </div>

               <div className="mt-10 flex gap-4 pt-8 border-t border-gray-50">
                  <button 
                    onClick={() => handleStatusUpdate('CANCELLED')}
                    className="flex-1 py-4 text-red-600 font-black text-xs uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all border border-red-100"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate('CONFIRMED')}
                    className="flex-[1.5] py-4 bg-blue-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-950 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} /> Confirm Payment
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}