"use client";
import Navbar from "@/app/components/Navbar";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function NewBookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter(); // This must be lowercase 'router'
  const roomId = searchParams.get("roomId");

  const [isVerifying, setIsVerifying] = useState(true);
  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    transactionNum: "",
    screenshot: null as File | null,
  });

  // --- SECURITY GUARD ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token, kick the user to login
      router.push("/login");
    } else {
      setIsVerifying(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const formDataToSend = new FormData();
  
  // Create JSON blob for the 'booking' part
  const bookingBlob = new Blob([JSON.stringify({
    guestId: user.id,
    roomId: Number(roomId),
    checkInDate: formData.checkInDate,
    checkOutDate: formData.checkOutDate,
    transactionNum: formData.transactionNum,
  })], { type: 'application/json' });

  formDataToSend.append("booking", bookingBlob);
  
  if (formData.screenshot) {
    formDataToSend.append("file", formData.screenshot);
  }

  try {
    const response = await fetch("http://localhost:8081/api/bookings/create", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
        // NOTE: Do NOT add 'Content-Type': 'multipart/form-data'. 
        // The browser adds it automatically with the correct boundary.
      },
      body: formDataToSend,
    });

    if (response.ok) {
      alert("Booking submitted successfully!");
      router.push("/my-bookings");
    } else {
      // THIS WILL NOW SHOW YOU THE ERROR (like 'File too large')
      const errorMsg = await response.text();
      alert("Submission Error: " + errorMsg);
    }
  } catch (err) {
    alert("Network Error: Make sure Spring Boot is running.");
    console.error(err);
  }
};

  // If we are checking the token, show nothing or a loader
  if (isVerifying) {
    return <div className="h-screen flex items-center justify-center">Verifying session...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">Complete Your Reservation</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Check-In</label>
                <input type="date" required className="w-full p-3 border rounded-xl" 
                  onChange={(e) => setFormData({...formData, checkInDate: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Check-Out</label>
                <input type="date" required className="w-full p-3 border rounded-xl" 
                  onChange={(e) => setFormData({...formData, checkOutDate: e.target.value})} />
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-2">Payment Instructions</h3>
              <p className="text-sm text-blue-800">Please transfer the total amount to: <br/> 
              <strong>Bank:</strong> Global Bank <br/> 
              <strong>Account:</strong> 1234-5678-90 <br/> 
              <strong>Name:</strong> Grand Reserve Hotel</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Transaction Number</label>
              <input type="text" required placeholder="Enter reference number" 
                className="w-full p-3 border rounded-xl"
                onChange={(e) => setFormData({...formData, transactionNum: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Upload Screenshot</label>
              <input type="file" accept="image/*" required 
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => setFormData({...formData, screenshot: e.target.files?.[0] || null})} />
            </div>

            <button type="submit" className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-all">
              Confirm & Upload Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}