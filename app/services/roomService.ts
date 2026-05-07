// src/services/roomService.ts
import { Room } from "../models/types";

const API_URL = "http://localhost:8081/api/rooms";

export const roomService = {
  getAllRooms: async (): Promise<Room[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch rooms");
    return response.json();
  },

  getRoomById: async (id: number): Promise<Room> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Room not found");
    return response.json();
  },

  // ADDED: Create Room
  addRoom: async (roomData: any, token: string): Promise<Room> => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(roomData),
    });
    if (!response.ok) throw new Error("Could not add room");
    return response.json();
  },

  // ADDED: Update Room
  updateRoom: async (id: number, roomData: any, token: string): Promise<Room> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(roomData),
    });
    if (!response.ok) throw new Error("Update failed");
    return response.json();
  },

  // ADDED: Delete Room
  deleteRoom: async (id: number, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Delete failed");
  }
};