import { Booking } from "@/models/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_URL = `${BASE_URL}/api/bookings`;
export const bookingService = {
  // 1. Get all bookings (Manager only)
  getAllBookings: async (token: string): Promise<Booking[]> => {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch all bookings");
    return response.json();
  },

  // 2. Get bookings for a specific guest
  getBookingsByUserId: async (userId: number, token: string): Promise<Booking[]> => {
    const response = await fetch(`${API_URL}/user/${userId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch user bookings");
    return response.json();
  },

  // 3. Delete a booking (Manager only)
  deleteBooking: async (id: number, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Delete failed");
  },

updateStatus: async (bookingId: number, status: string, receptionistId: number, token: string): Promise<any> => {
    // Matches: @PatchMapping("/{id}/status") with @RequestParam
    const response = await fetch(`${API_URL}/${bookingId}/status?status=${status}&receptionistId=${receptionistId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg || "Failed to update status");
    }
    return response.json();
  }
  
};



