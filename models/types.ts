export enum UserRole {
  GUEST = "GUEST",
  RECEPTIONIST = "RECEPTIONIST",
  MANAGER = "MANAGER",
}

export enum RoomStatus {
  AVAILABLE = "AVAILABLE",
  DIRTY = "DIRTY",
  MAINTENANCE = "MAINTENANCE",
}

export interface Room {
  id: number;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  capacity: number;
  status: RoomStatus;
  description: string;
   priceUsd: number; 
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface Booking {
  id: number;
  guestName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: string;

    screenshotUrl: string;    
  transactionNum: string; 

   senderFullName: string; 
}