

"use client";
import { useEffect, useState, useMemo } from "react";
import { Bed, Plus, Edit, Trash2, X, Search, Filter, AlertTriangle, CheckCircle, Info, Hash, DollarSign, Users, Type } from "lucide-react";
import { roomService } from "@/services/roomService";
import { Room, RoomStatus } from "@/models/types";

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals & Notifications
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<number | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Field-level Validation State
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.roomNumber) errors.roomNumber = "Room number is required";
    if (formData.pricePerNight <= 0) errors.pricePerNight = "Price must be greater than 0";
    if (formData.capacity <= 0) errors.capacity = "Capacity must be at least 1";
    if (!formData.description) errors.description = "Please provide a short description";
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token") || "";
    try {
      if (editingRoom) {
        await roomService.updateRoom(editingRoom.id, formData, token);
        showNotify("Room configuration updated", "success");
      } else {
        await roomService.addRoom(formData, token);
        showNotify("New room registered successfully", "success");
      }
      setIsModalOpen(false);
      loadRooms();
    } catch (err) { 
        showNotify("Server Error: Check if room number is unique", "error"); 
    }
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setFieldErrors({});
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

  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      const matchesSearch = r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           r.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rooms, searchQuery, statusFilter]);

  const confirmDelete = async () => {
    if (!roomToDelete) return;
    const token = localStorage.getItem("token") || "";
    try {
      await roomService.deleteRoom(roomToDelete, token);
      setRooms(rooms.filter(r => r.id !== roomToDelete));
      showNotify("Room removed from inventory", "success");
    } catch (err) { showNotify("Delete failed: Dependency error", "error"); }
    finally { setRoomToDelete(null); }
  };

  return (
    <div className="space-y-6 relative">
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Room Management</h1>
        </div>
        <button 
          onClick={() => { 
              setEditingRoom(null); 
              setFieldErrors({});
              setFormData({roomNumber:"", roomType:"SINGLE", pricePerNight:0, capacity:1, description:"", status: RoomStatus.AVAILABLE }); 
              setIsModalOpen(true); 
          }}
          className="bg-blue-900 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={20} /> Add New Room
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Search by number or feature..." className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2">
          <Filter size={18} className="text-gray-400" />
          <select className="bg-transparent outline-none text-gray-600 font-medium" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} >
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
          <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
            <tr>
              <th className="px-6 py-4">Room Number</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Rate</th>
              <th className="px-6 py-4">Current Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredRooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{room.roomNumber}</td>
                <td className="px-6 py-4 font-bold text-blue-600 text-xs uppercase">{room.roomType}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{room.pricePerNight} ETB</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    room.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 
                    room.status === 'DIRTY' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {room.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openEditModal(room)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18} /></button>
                  <button onClick={() => setRoomToDelete(room.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- HORIZONTAL MODERN MODAL (13-inch PC Optimized) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                {editingRoom ? `Edit Room ${editingRoom.roomNumber}` : "Register New Room"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X/></button>
            </div>

            <form onSubmit={handleSave} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* COLUMN 1: IDENTIFICATION */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Room Identity</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                      <input type="text" className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-900 transition-all ${fieldErrors.roomNumber ? 'border-red-300' : 'border-gray-100'}`} placeholder="e.g. 104-B" value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} />
                    </div>
                    {fieldErrors.roomNumber && <p className="text-red-500 text-[10px] mt-1 font-bold italic">{fieldErrors.roomNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Category</label>
                      <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-900" value={formData.roomType} onChange={e => setFormData({...formData, roomType: e.target.value})}>
                        <option value="SINGLE">Single</option>
                        <option value="DOUBLE">Double</option>
                        <option value="DELUXE">Deluxe</option>
                        <option value="SUITE">Suite</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Nightly Rate</label>
                      <div className="relative">
                        {/* <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16}/> */}
                        <input type="number" className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-900 transition-all ${fieldErrors.pricePerNight ? 'border-red-300' : 'border-gray-100'}`} value={formData.pricePerNight} onChange={e => setFormData({...formData, pricePerNight: Number(e.target.value)})} />
                      </div>
                      {fieldErrors.pricePerNight && <p className="text-red-500 text-[10px] mt-1 font-bold italic">{fieldErrors.pricePerNight}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Guest Capacity</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                      <input type="number" className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-900 transition-all ${fieldErrors.capacity ? 'border-red-300' : 'border-gray-100'}`} value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} />
                    </div>
                    {fieldErrors.capacity && <p className="text-red-500 text-[10px] mt-1 font-bold italic">{fieldErrors.capacity}</p>}
                  </div>
                </div>

                {/* COLUMN 2: STATUS & DESCRIPTION */}
                <div className="space-y-5">
                  <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                    <label className="block text-[10px] font-black uppercase text-blue-400 mb-2">Operational Status</label>
                    <select 
                        className="w-full p-2 bg-white border border-blue-200 rounded-xl font-black text-blue-900 outline-none cursor-pointer"
                        value={formData.status} 
                        onChange={e => setFormData({...formData, status: e.target.value as RoomStatus})}
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="DIRTY">Dirty</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </select>
                    <p className="text-[9px] text-blue-600 mt-2 font-bold uppercase tracking-tight">Status determines visibility in public search.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Detailed Description</label>
                    <textarea 
                        className={`w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-900 transition-all resize-none ${fieldErrors.description ? 'border-red-300' : 'border-gray-100'}`} 
                        rows={4} 
                        placeholder="Describe room features (e.g. Sea view, Balcony)..." 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                    />
                    {fieldErrors.description && <p className="text-red-500 text-[10px] mt-1 font-bold italic">{fieldErrors.description}</p>}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-gray-400 hover:bg-gray-100 rounded-2xl transition-all">Discard</button>
                <button type="submit" className="flex-[2] py-4 bg-blue-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-800 transition-all">
                  {editingRoom ? "Save Configuration" : "Finalize Room Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {roomToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-sm p-8 text-center shadow-2xl border border-gray-100">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={30}/></div>
            <h2 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Delete Room?</h2>
            <p className="text-gray-500 text-sm mb-8 italic">Permanently removes this unit and associated history from the server data-stream.</p>
            <div className="flex gap-3">
              <button onClick={() => setRoomToDelete(null)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-600">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-100">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}