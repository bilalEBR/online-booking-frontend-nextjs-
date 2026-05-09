"use client";
import { useEffect, useState, useMemo } from "react";
import { UserCog, Plus, ShieldCheck, X, Trash2, Edit2, CheckCircle, AlertTriangle, Mail, Phone, Lock } from "lucide-react";
import { userService, UserResponse } from "@/app/services/userService";

export default function StaffManagement() {
  const [staffList, setStaffList] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal configurations
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<UserResponse | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Form parameters
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: ""
  });

  useEffect(() => { loadStaff(); }, []);

  const showNotify = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadStaff = async () => {
    const token = localStorage.getItem("token") || "";
    try {
      const data = await userService.getAllUsers(token);
      // Filter exclusively out the RECEPTIONIST operational profiles
      setStaffList(data.filter(u => u.role === "RECEPTIONIST"));
    } catch (err) {
      showNotify("Could not retrieve system configurations", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || "";

    // Field Length Validation
    if (!editingStaff && formData.password.length < 4) {
      showNotify("Security parameter (Password) must be at least 4 characters", "error");
      return;
    }

    try {
      if (editingStaff) {
        await userService.updateUser(editingStaff.id, formData, token);
        showNotify("Receptionist system profile updated", "success");
      } else {
        await userService.createStaff(formData, token);
        showNotify("New internal receptionist profile configured", "success");
      }
      setIsModalOpen(false);
      setFormData({ fullName: "", email: "", phone: "", password: "" });
      loadStaff();
    } catch (err: any) {
      showNotify(err.message || "Operation rejected by server", "error");
    }
  };

  const openEditModal = (staff: UserResponse) => {
    setEditingStaff(staff);
    setFormData({
      fullName: staff.fullName,
      email: staff.email,
      phone: staff.phone,
      password: "PROTECTED_MOCK_PASSWORD" // Bypass frontend placeholder validation rules safely
    });
    setIsModalOpen(true);
  };

  const confirmRevoke = async () => {
    if (!staffToDelete) return;
    const token = localStorage.getItem("token") || "";
    try {
      await userService.deleteUser(staffToDelete, token);
      setStaffList(staffList.filter(s => s.id !== staffToDelete));
      showNotify("Staff credentials revoked successfully", "success");
    } catch (err) {
      showNotify("System permission clear down failed", "error");
    } finally {
      setStaffToDelete(null);
    }
  };

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

      {/* Header Panel */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          {/* <p className="text-gray-500">Manage receptionist accounts and permissions.</p> */}
        </div>
        <button 
          onClick={() => { setEditingStaff(null); setFormData({ fullName: "", email: "", phone: "", password: "" }); setIsModalOpen(true); }}
          className="bg-blue-900 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={20} /> Add New Staff
        </button>
      </div>

      {/* Dynamic Cards Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Processing team records...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffList.map((staff) => (
            <div key={staff.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 p-4">
                {/* <ShieldCheck className="text-green-500 opacity-10 group-hover:scale-110 transition-transform" size={70} /> */}
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-900 font-bold shadow-inner">
                  <UserCog size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{staff.fullName}</h3>
                  <p className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-black uppercase tracking-wider inline-block">
                    {staff.role}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-sm text-gray-500 mb-6">
                <p className="flex items-center gap-2"><Mail size={14} /> {staff.email}</p>
                <p className="flex items-center gap-2"><Phone size={14} /> {staff.phone}</p>
              </div>

              <div className="flex border-t border-gray-50 pt-4 gap-2">
                <button 
                  onClick={() => openEditModal(staff)}
                  className="flex-1 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100"
                >
                  Edit
                </button>
                <button 
                  onClick={() => setStaffToDelete(staff.id)}
                  className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REVOCATION MODAL */}
      {staffToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Revoke Access?</h2>
            <p className="text-gray-500 text-sm mb-6">This operator will be deleted instantly from database parameters and loses server workspace connectivity.</p>
            <div className="flex gap-3">
              <button onClick={() => setStaffToDelete(null)} className="flex-1 py-3 font-bold text-gray-600 bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={confirmRevoke} className="flex-1 py-3 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700">Revoke</button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE WORKSPACE FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">{editingStaff ? "Modify Staff Parameters" : "Provision Staff Account"}</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <input required type="text" className="w-full p-3 border rounded-xl outline-none" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">System Email</label>
                <input required type="email"  className="w-full p-3 border rounded-xl outline-none disabled:bg-gray-100" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Workspace Phone Contact</label>
                <input required type="text" className="w-full p-3 border rounded-xl outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              
              {/* Only require encryption tokens for new provisions */}
              {!editingStaff && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Login Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input required type="password" className="w-full pl-10 pr-3 p-3 border rounded-xl outline-none" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  </div>
                </div>
              )}

              <button type="submit" className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg mt-2">
                {editingStaff ? "Update staff" : "Create staff"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}