 


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const AUTH_URL = `${BASE_URL}/api/auth`;
const USER_URL = `${BASE_URL}/api/users`;
export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

export const userService = {
  register: async (userData: any) => {
    const response = await fetch(`${USER_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Registration failed");
    return response.json();
  },

  login: async (credentials: any) => {
    const response = await fetch(`${AUTH_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error("Invalid credentials");
    return response.json();
  },

  getAllUsers: async (token: string): Promise<UserResponse[]> => {
    const response = await fetch(USER_URL, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },

  deleteUser: async (id: number, token: string): Promise<void> => {
    const response = await fetch(`${USER_URL}/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Failed to delete user");
  },

  // --- ADDED: CREATE STAFF MEMBER (RECEPTIONIST) ---
  createStaff: async (staffData: any, token: string): Promise<UserResponse> => {
    const response = await fetch(`${USER_URL}/staff`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(staffData)
    });
    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(errMsg || "Failed to create receptionist");
    }
    return response.json();
  },

  // --- ADDED: UPDATE STAFF MEMBER ---
// src/services/userService.ts
updateUser: async (id: number, userData: any, token: string): Promise<UserResponse> => {
  const response = await fetch(`${USER_URL}/${id}`, {
    method: "PUT", // Ensure this is PUT
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const errMsg = await response.text();
    throw new Error(errMsg || "Failed to update user");
  }
  return response.json();
},
};