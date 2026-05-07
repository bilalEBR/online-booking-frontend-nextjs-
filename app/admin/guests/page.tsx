// "use client";
// import { useEffect, useState, useMemo } from "react";
// import { Users, Search, Trash2, Info, AlertTriangle, CheckCircle } from "lucide-react";
// import { userService, UserResponse } from "@/app/services/userService";

// export default function GuestManagement() {
//   const [users, setUsers] = useState<UserResponse[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [userToDelete, setUserToDelete] = useState<number | null>(null);
//   const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

//   useEffect(() => { loadGuests(); }, []);

//   const loadGuests = async () => {
//     const token = localStorage.getItem("token") || "";
//     try {
//       const data = await userService.getAllUsers(token);
//       // Filter only GUESTS for this page
//       setUsers(data.filter(u => u.role === "GUEST"));
//     } catch (err) {
//       showNotify("Failed to load guests", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showNotify = (msg: string, type: 'success' | 'error') => {
//     setNotification({ msg, type });
//     setTimeout(() => setNotification(null), 4000);
//   };

//   const confirmDelete = async () => {
//     if (!userToDelete) return;
//     const token = localStorage.getItem("token") || "";
//     try {
//       await userService.deleteUser(userToDelete, token);
//       setUsers(users.filter(u => u.id !== userToDelete));
//       showNotify("Guest account removed", "success");
//     } catch (err) {
//       showNotify("Could not delete user", "error");
//     } finally {
//       setUserToDelete(null);
//     }
//   };

//   const filteredGuests = useMemo(() => {
//     return users.filter(u => 
//       u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
//       u.email.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [users, searchQuery]);

//   return (
//     <div className="space-y-6">
//       {notification && (
//         <div className={`fixed top-5 right-5 z-[200] px-6 py-4 rounded-2xl shadow-2xl text-white font-bold ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
//           {notification.msg}
//         </div>
//       )}

//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Guest Management</h1>
//           <p className="text-gray-500">Manage all registered customer accounts.</p>
//         </div>
//       </div>

//       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center">
//           <div className="relative w-full max-w-md">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input 
//               type="text" 
//               placeholder="Search by name or email..." 
//               className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </div>

//         <table className="w-full text-left">
//           <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
//             <tr>
//               <th className="px-6 py-4 font-semibold">Full Name</th>
//               <th className="px-6 py-4 font-semibold">Email</th>
//               <th className="px-6 py-4 font-semibold">Phone</th>
//               <th className="px-6 py-4 font-semibold text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-50">
//             {filteredGuests.map((guest) => (
//               <tr key={guest.id} className="hover:bg-gray-50/50 transition-colors">
//                 <td className="px-6 py-4 font-bold text-gray-900">{guest.fullName}</td>
//                 <td className="px-6 py-4 text-gray-600">{guest.email}</td>
//                 <td className="px-6 py-4 text-gray-600">{guest.phone}</td>
//                 <td className="px-6 py-4 text-right">
//                   <button 
//                     onClick={() => setUserToDelete(guest.id)}
//                     className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {!loading && filteredGuests.length === 0 && (
//           <div className="p-20 text-center text-gray-400 italic flex flex-col items-center gap-2">
//             <Info size={40} />
//             No guest accounts found.
//           </div>
//         )}
//       </div>

//       {/* Delete Confirmation Modal */}
//       {userToDelete && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150] flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl">
//             <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <AlertTriangle size={32} />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Guest?</h2>
//             <p className="text-gray-500 mb-8">This will permanently delete this user account. They will no longer be able to log in.</p>
//             <div className="flex gap-3">
//               <button onClick={() => setUserToDelete(null)} className="flex-1 py-3 font-bold text-gray-600 bg-gray-100 rounded-xl">Cancel</button>
//               <button onClick={confirmDelete} className="flex-1 py-3 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700">Delete</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import { useEffect, useState, useMemo } from "react";
import { Users, Search, Trash2, Edit, Plus, X, CheckCircle, AlertTriangle, Info, Mail, Phone, Lock, User } from "lucide-react";
import { userService, UserResponse } from "@/app/services/userService";

export default function GuestManagement() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<UserResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Form parameters - Password starts empty here
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", password: "" });

  useEffect(() => { loadGuests(); }, []);

  const loadGuests = async () => {
    const token = localStorage.getItem("token") || "";
    try {
      const data = await userService.getAllUsers(token);
      setUsers(data.filter(u => u.role === "GUEST"));
    } catch (err) { showNotify("Failed to load guests", "error"); }
    finally { setLoading(false); }
  };

  const showNotify = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || "";
    try {
      if (editingGuest) {
        await userService.updateUser(editingGuest.id, formData, token);
        showNotify("Guest profile updated", "success");
      } else {
        // Uses your existing register method
        await userService.register(formData); 
        showNotify("New guest registered successfully", "success");
      }
      setIsModalOpen(false);
      loadGuests();
    } catch (err: any) {
      showNotify("Operation failed: Check if email is unique", "error");
    }
  };

  const openEditModal = (guest: UserResponse) => {
    setEditingGuest(guest);
    // Populate existing data, password field is set to a placeholder for security
    setFormData({ 
        fullName: guest.fullName, 
        email: guest.email, 
        phone: guest.phone, 
        password: "EXISTING_USER" 
    });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    const token = localStorage.getItem("token") || "";
    try {
      await userService.deleteUser(userToDelete, token);
      setUsers(users.filter(u => u.id !== userToDelete));
      showNotify("Guest account removed", "success");
    } catch (err) { showNotify("Delete failed", "error"); }
    finally { setUserToDelete(null); }
  };

  const filteredGuests = useMemo(() => {
    return users.filter(u => 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  return (
    <div className="space-y-6 relative">
      {/* Dynamic Notifications */}
      {notification && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold animate-in slide-in-from-right ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header with "Add New Guest" button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Guest Management</h1>
          {/* <p className="text-gray-500">Add and manage hotel customers.</p> */}
        </div>
        <button 
          onClick={() => { 
            setEditingGuest(null); 
            // ENSURE EVERYTHING IS EMPTY FOR NEW GUEST
            setFormData({fullName:"", email:"", phone:"", password:""}); 
            setIsModalOpen(true); 
          }}
          className="bg-blue-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-800 transition-all shadow-lg"
        >
          <Plus size={20} /> Add New Guest
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search guests by name or email..." 
            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Guests Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
            <tr>
              <th className="px-8 py-5">Full Name</th>
              <th className="px-8 py-5">Email</th>
              <th className="px-8 py-5">Phone</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredGuests.map((guest) => (
              <tr key={guest.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-8 py-5 font-bold text-gray-900">{guest.fullName}</td>
                <td className="px-8 py-5 text-gray-600">{guest.email}</td>
                <td className="px-8 py-5 text-gray-600">{guest.phone}</td>
                <td className="px-8 py-5 text-right space-x-2">
                  <button onClick={() => openEditModal(guest)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18}/></button>
                  <button onClick={() => setUserToDelete(guest.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- HORIZONTAL MODERN MODAL (Saves height for 13-inch screens) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-black text-gray-900">
                {editingGuest ? "Update Guest Details" : "Register New Guest"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
            </div>

            <form onSubmit={handleSave} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* LEFT COLUMN */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                      <input required type="text" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-900 transition-all" placeholder="John Doe" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Email Address </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                      <input 
                        required 
                        type="email" 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-900 transition-all" 
                        // placeholder="guest@example.com" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                      <input required type="text" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-900 transition-all" placeholder="+1 234 567 890" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>
                  
                  {!editingGuest ? (
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Account Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <input 
                          required 
                          type="password" 
                          minLength={4} 
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-900 transition-all" 
                        //   placeholder="••••••••" 
                          value={formData.password} // This will be "" on add
                          onChange={e => setFormData({...formData, password: e.target.value})} 
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 h-[76px] flex items-center">
                       <p className="text-[11px] text-blue-700 leading-tight font-medium flex items-center gap-2">
                         <Info size={14} /> Password is encrypted and cannot be viewed by management.
                       </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-gray-400 hover:bg-gray-50 rounded-2xl">Cancel</button>
                <button type="submit" className="flex-[2] py-4 bg-blue-900 text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-800 transition-all">
                  {editingGuest ? "Save Changes" : "Complete Registration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150] flex items-center justify-center">
          <div className="bg-white p-8 rounded-[32px] text-center max-w-sm shadow-2xl border border-gray-100">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={30}/></div>
            <h2 className="text-xl font-black mb-2">Delete Account?</h2>
            <p className="text-gray-500 text-sm mb-8">Permanently removes this guest and their data from the system.</p>
            <div className="flex gap-3">
              <button onClick={() => setUserToDelete(null)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}