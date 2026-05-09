

"use client";
import Navbar from "@/app/components/Navbar";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Calendar, CreditCard, User, Info, CheckCircle, AlertTriangle, Image as ImageIcon, ArrowRight, Hash } from "lucide-react";
import { roomService } from "@/services/roomService";
import { Room } from "@/models/types";

export default function NewBookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = searchParams.get("roomId");

  const [isVerifying, setIsVerifying] = useState(true);
  const [room, setRoom] = useState<Room | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // 1. STATE FOR NOTIFICATIONS & VALIDATION
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [formData, setFormData] = useState({
    senderName: "",
    checkInDate: "",
    checkOutDate: "",
    transactionNum: "",
    screenshot: null as File | null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    if (roomId) {
      roomService.getRoomById(Number(roomId))
        .then(setRoom)
        .catch(() => showNotify("Error loading room details", "error"))
        .finally(() => setIsVerifying(false));
    }
  }, [roomId, router]);

  const showNotify = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    if (type === 'error') setTimeout(() => setNotification(null), 4000);
  };

  // 2. PRICING & LOGIC VALIDATION
  const pricing = useMemo(() => {
    if (!formData.checkInDate || !formData.checkOutDate || !room) return null;
    const start = new Date(formData.checkInDate);
    const end = new Date(formData.checkOutDate);
    const diffTime = end.getTime() - start.getTime();
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (nights <= 0) return { error: "Check-out must be after check-in" };
    return { nights, total: nights * room.pricePerNight };
  }, [formData.checkInDate, formData.checkOutDate, room]);

  // 3. MANUAL VALIDATION FUNCTION
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.senderName) errors.senderName = "Full name of sender is required";
    if (!formData.checkInDate) errors.checkInDate = "Check-in date is required";
    if (!formData.checkOutDate) errors.checkOutDate = "Check-out date is required";
    if (!formData.transactionNum) errors.transactionNum = "Reference number is required";
    if (!formData.screenshot) errors.screenshot = "Please upload payment proof";
    if (pricing?.error) errors.checkOutDate = pricing.error;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, screenshot: file });
      setPreviewUrl(URL.createObjectURL(file));
      setFieldErrors(prev => ({ ...prev, screenshot: "" })); // Clear error on select
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
        showNotify("Please fix the errors in the form", "error");
        return;
    }

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const formDataToSend = new FormData();
    
    const bookingBlob = new Blob([JSON.stringify({
      guestId: user.id,
      roomId: Number(roomId),
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      transactionNum: formData.transactionNum,
      senderFullName: formData.senderName 
    })], { type: 'application/json' });

    formDataToSend.append("booking", bookingBlob);
    if (formData.screenshot) formDataToSend.append("file", formData.screenshot);

    try {
      const response = await fetch(`${BASE_URL}/api/bookings/create`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formDataToSend,
      });

      if (response.ok) {
        showNotify("Booking Successful! Redirecting...", "success");
        setTimeout(() => router.push("/my-bookings"), 2000);
      } else {
        const errorMsg = await response.text();
        showNotify(errorMsg, "error");
      }
    } catch (err) {
      showNotify("Network Error: Backend is offline", "error");
    }
  };

  if (isVerifying || !room) return <div className="h-screen flex items-center justify-center">Verifying room data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />

      {/* TOP NOTIFICATION */}
      {notification && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold animate-in slide-in-from-right ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20}/> : <AlertTriangle size={20}/>}
          <span>{notification.msg}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 min-h-[600px]">
          
          {/* LEFT SIDE: PRICE ANALYSIS */}
          <div className="w-full md:w-5/12 bg-blue-950 text-white p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-3xl font-black">Room {room.roomNumber}</h2>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-sm mb-4">Pricing Analysis</p>
                <div className="flex justify-between mb-2"><span>Rate</span><span>{room.pricePerNight} ETB</span></div>
                {pricing && !pricing.error && (
                  <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                    <span className="text-lg">Total</span>
                    <span className="text-3xl font-black text-blue-400">{pricing.total} ETB</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-8">
               <p className="text-[10px] uppercase text-blue-400 mb-2 font-bold tracking-widest">Receipt Preview</p>
               <div className="aspect-video bg-black/40 rounded-2xl border-2 border-dashed border-white/20 overflow-hidden flex items-center justify-center">
                  {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <ImageIcon className="opacity-20" size={48}/>}
               </div>
            </div>
          </div>

          {/* RIGHT SIDE: FORM WITH VALIDATION LABELS */}
          <div className="w-full md:w-7/12 p-8 md:p-12">
            <h1 className="text-2xl font-black text-gray-900 mb-8">Reservation Details</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Sender Name */}
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest ml-1">Sender Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                  <input type="text" className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-900 transition-all ${fieldErrors.senderName ? 'border-red-300 bg-red-50' : 'border-gray-100'}`} placeholder="Full name on bank account" value={formData.senderName} onChange={e => setFormData({...formData, senderName: e.target.value})} />
                </div>
                {fieldErrors.senderName && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold italic">{fieldErrors.senderName}</p>}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1 tracking-widest">Check-In</label>
                  <input type="date" className={`w-full p-3.5 bg-gray-50 border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-900 ${fieldErrors.checkInDate ? 'border-red-300' : 'border-gray-100'}`} value={formData.checkInDate} onChange={e => setFormData({...formData, checkInDate: e.target.value})} />
                  {fieldErrors.checkInDate && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold italic">{fieldErrors.checkInDate}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1 tracking-widest">Check-Out</label>
                  <input type="date" className={`w-full p-3.5 bg-gray-50 border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-900 ${fieldErrors.checkOutDate ? 'border-red-300' : 'border-gray-100'}`} value={formData.checkOutDate} onChange={e => setFormData({...formData, checkOutDate: e.target.value})} />
                  {fieldErrors.checkOutDate && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold italic">{fieldErrors.checkOutDate}</p>}
                </div>
              </div>

              {/* Ref Number */}
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest ml-1">Transaction ID</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                  <input type="text" className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-900 ${fieldErrors.transactionNum ? 'border-red-300 bg-red-50' : 'border-gray-100'}`} placeholder="TXN-XXXX-XXXX" value={formData.transactionNum} onChange={e => setFormData({...formData, transactionNum: e.target.value})} />
                </div>
                {fieldErrors.transactionNum && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold italic">{fieldErrors.transactionNum}</p>}
              </div>

              {/* Image Upload */}
              <div>
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-3xl transition-all cursor-pointer ${fieldErrors.screenshot ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
                  <ImageIcon className={`${fieldErrors.screenshot ? 'text-red-400' : 'text-gray-400'}`} size={24}/>
                  <p className="text-xs text-gray-500 mt-2 font-bold">{formData.screenshot ? formData.screenshot.name : 'Upload Screenshot'}</p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
                {fieldErrors.screenshot && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold italic">{fieldErrors.screenshot}</p>}
              </div>

              <button type="submit" className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black text-sm hover:bg-blue-800 transition-all flex items-center justify-center gap-2">
                Confirm & Pay <ArrowRight size={18}/>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}