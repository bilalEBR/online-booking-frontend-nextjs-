"use client";
import { useEffect, useState, useMemo } from "react";
import { History, Trash2, Search, Filter, AlertTriangle, CheckCircle, Info, Download } from "lucide-react";
import { bookingService } from "@/app/services/bookingService";
import { Booking } from "@/app/models/types";

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => { loadAllBookings(); }, []);

  const showNotify = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadAllBookings = async () => {
    const token = localStorage.getItem("token") || "";
    try {
      const data = await bookingService.getAllBookings(token);
      setBookings(data);
    } catch (err) { showNotify("Failed to load booking history", "error"); }
    finally { setLoading(false); }
  };

  // --- Search & Filter Logic ---
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch = b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           b.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ;
                        //    b.transactionNum.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "" || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  const confirmDelete = async () => {
    if (!bookingToDelete) return;
    const token = localStorage.getItem("token") || "";
    try {
      await bookingService.deleteBooking(bookingToDelete, token);
      setBookings(bookings.filter(b => b.id !== bookingToDelete));
      showNotify("Booking record deleted", "success");
    } catch (err) { showNotify("Could not delete record", "error"); }
    finally { setBookingToDelete(null); }
  };

  return (
    <div className="space-y-6 relative">
      {/* Notification Banner */}
      {notification && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          {notification.msg}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <History className="text-blue-900" /> Booking History
          </h1>
          {/* <p className="text-gray-500">Archive of all guest reservations and payments.</p> */}
        </div>
        {/* <button className="bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all">
          <Download size={20} /> Export CSV
        </button> */}
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by guest name" 
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-900 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2">
          <Filter size={18} className="text-gray-400" />
          <select 
            className="bg-transparent outline-none text-gray-600 font-medium"
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

      {/* DATA TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
           <div className="p-20 text-center text-gray-400">Loading history...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Guest Name</th>
                <th className="px-6 py-4 font-semibold">Room</th>
                <th className="px-6 py-4 font-semibold">Dates</th>
                <th className="px-6 py-4 font-semibold">Total Price</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{booking.guestName}</td>
                  <td className="px-6 py-4 text-blue-600 font-bold">Room {booking.roomNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {booking.checkInDate} to {booking.checkOutDate}
                  </td>
                  <td className="px-6 py-4 font-black text-gray-900">{booking.totalPrice} ETB</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setBookingToDelete(booking.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filteredBookings.length === 0 && (
          <div className="p-20 text-center text-gray-400 italic">No records found.</div>
        )}
      </div>

      {/* DELETE MODAL */}
      {bookingToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Record?</h2>
            <p className="text-gray-500 mb-8 text-sm">This will permanently remove the booking record from the system history.</p>
            <div className="flex gap-3">
              <button onClick={() => setBookingToDelete(null)} className="flex-1 py-3 font-bold text-gray-600 bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 font-bold text-white bg-red-600 rounded-xl">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}