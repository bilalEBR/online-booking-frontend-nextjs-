"use client";
import { useEffect, useState, useMemo } from "react";
import { Bed, Plus, Edit, Trash2, X, Search, Filter, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { roomService } from "@/app/services/roomService";
import { Room, RoomStatus } from "@/app/models/types";

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals & Notifications
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<number | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "SINGLE",
    pricePerNight: 0,
    capacity: 1,
    description: "",
    status: "AVAILABLE" as RoomStatus
  });

  useEffect(() => { loadRooms(); }, []);

  const showNotify = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadRooms = async () => {
    try {
      const data = await roomService.getAllRooms();
      setRooms(data);
    } catch (err) { showNotify("Failed to load rooms", "error"); }
    finally { setLoading(false); }
  };

  // --- Search & Filter Logic ---
  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      const matchesSearch = r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           r.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rooms, searchQuery, statusFilter]);

  // --- Action Handlers ---
  const confirmDelete = async () => {
    if (!roomToDelete) return;
    const token = localStorage.getItem("token") || "";
    try {
      await roomService.deleteRoom(roomToDelete, token);
      setRooms(rooms.filter(r => r.id !== roomToDelete));
      showNotify("Room deleted successfully", "success");
    } catch (err) { showNotify("Delete failed: Check dependencies", "error"); }
    finally { setRoomToDelete(null); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple Validation
    if (formData.pricePerNight <= 0 || formData.capacity <= 0) {
      showNotify("Price and Capacity must be greater than 0", "error");
      return;
    }

    const token = localStorage.getItem("token") || "";
    try {
      if (editingRoom) {
        await roomService.updateRoom(editingRoom.id, formData, token);
        showNotify("Room updated successfully", "success");
      } else {
        await roomService.addRoom(formData, token);
        showNotify("New room added successfully", "success");
      }
      setIsModalOpen(false);
      loadRooms();
    } catch (err) { showNotify("Operation failed. Check input data.", "error"); }
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      description: room.description,
      status: room.status as RoomStatus
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 relative">
      {/* Notifications */}
      {notification && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right ${
          notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <span className="font-bold">{notification.msg}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
          {/* <p className="text-gray-500">Manage hotel inventory and status.</p> */}
        </div>
        <button 
          onClick={() => { setEditingRoom(null); setFormData({roomNumber:"", roomType:"SINGLE", pricePerNight:0, capacity:1, description:"", status: RoomStatus.AVAILABLE }); setIsModalOpen(true); }}
          className="bg-blue-900 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-800 transition-all"
        >
          <Plus size={20} /> Add New Room
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by room number or description..." 
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
            <option value="AVAILABLE">Available</option>
            <option value="DIRTY">Dirty</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b">
            <tr>
              <th className="px-6 py-4 font-semibold">Room #</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredRooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{room.roomNumber}</td>
                <td className="px-6 py-4"><span className="text-blue-600 font-bold text-xs uppercase">{room.roomType}</span></td>
                <td className="px-6 py-4 font-bold text-gray-900">${room.pricePerNight}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    room.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 
                    room.status === 'DIRTY' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {room.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button onClick={() => openEditModal(room)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                  <button onClick={() => setRoomToDelete(room.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRooms.length === 0 && (
            <div className="p-20 text-center text-gray-400 italic flex flex-col items-center gap-2">
                <Info size={40} />
                No rooms found matching your search.
            </div>
        )}
      </div>

      {/* DELETE VERIFICATION MODAL */}
      {roomToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Are you sure?</h2>
            <p className="text-gray-500 mb-8">This action cannot be undone. All related booking history might be affected.</p>
            <div className="flex gap-3">
              <button onClick={() => setRoomToDelete(null)} className="flex-1 py-3 font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b flex justify-between items-center bg-gray-50">
        <h2 className="text-xl font-bold text-gray-900">
          {editingRoom ? "Edit Room Details" : "Add New Room"}
        </h2>
        <button onClick={() => setIsModalOpen(false)}>
          <X className="text-gray-400 hover:text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-4">
        {/* Room Number */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Room Number</label>
          <input required type="text" className="w-full p-3 border border-gray-200 rounded-xl outline-none" 
            value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} />
        </div>

        {/* Type & Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Room Type</label>
            <select className="w-full p-3 border border-gray-200 rounded-xl bg-white outline-none" 
              value={formData.roomType} onChange={e => setFormData({...formData, roomType: e.target.value})}>
              <option value="SINGLE">Single</option>
              <option value="DOUBLE">Double</option>
              <option value="DELUXE">Deluxe</option>
              <option value="SUITE">Suite</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Price/Night</label>
            <input required type="number" className="w-full p-3 border border-gray-200 rounded-xl outline-none" 
              value={formData.pricePerNight} onChange={e => setFormData({...formData, pricePerNight: Number(e.target.value)})} />
          </div>
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Capacity</label>
          <input required type="number" className="w-full p-3 border border-gray-200 rounded-xl outline-none" 
            value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} />
        </div>

        {/* --- STATUS FIELD (ALWAYS SHOWN) --- */}
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
          <label className="block text-sm font-bold text-blue-900 mb-1">Current Room Status</label>
          <select 
            className="w-full p-2 bg-white border border-blue-200 rounded-lg font-bold text-blue-900 outline-none cursor-pointer"
            value={formData.status} 
            onChange={e => setFormData({...formData, status: e.target.value as RoomStatus})}
          >
            <option value="AVAILABLE">Available</option>
            <option value="DIRTY">Dirty</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
          <textarea className="w-full p-3 border border-gray-200 rounded-xl outline-none" rows={3} 
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>

        <button type="submit" className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg active:scale-95">
          {editingRoom ? "Save Room Updates" : "Create New Room"}
        </button>
      </form>
    </div>
  </div>
)}
    </div>
  );
}