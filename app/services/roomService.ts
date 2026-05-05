import { Room } from "../models/types";

const API_URL = "http://localhost:8081/api/rooms";

export const roomService = {
  // Get all rooms for the public list
  getAllRooms: async (): Promise<Room[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch rooms");
    return response.json();
  },

  // Get a single room detail
  getRoomById: async (id: number): Promise<Room> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Room not found");
    return response.json();
  }
};