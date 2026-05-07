// // Define the base URLs for different controllers
// const AUTH_URL = "http://localhost:8081/api/auth";
// const USER_URL = "http://localhost:8081/api/users";

// export interface LoginResponse {
//   id: number; // Ensure id is here
//   token: string;
//   fullName: string;
//   email: string;
//   role: string;
// }

// export const userService = {
//   // 1. Fixed the URL to point to /api/users/register
//   register: async (userData: any) => {
//     const response = await fetch(`${USER_URL}/register`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(userData),
//     });

//     if (!response.ok) {
//       const errorData = await response.text();
//       throw new Error(errorData || "Registration failed");
//     }
//     return response.json();
//   },

//   // 2. Login remains at /api/auth/login
//   login: async (credentials: any): Promise<LoginResponse> => {
//     const response = await fetch(`${AUTH_URL}/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(credentials),
//     });

//     if (!response.ok) {
//       const errorMsg = await response.text();
//       throw new Error(errorMsg || "Invalid email or password");
//     }

//     return response.json();
//   },
// };


// Inside src/services/userService.ts

const AUTH_URL = "http://localhost:8081/api/auth";
const USER_URL = "http://localhost:8081/api/users";

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
  updateUser: async (id: number, staffData: any, token: string): Promise<UserResponse> => {
    const response = await fetch(`${USER_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(staffData)
    });
    if (!response.ok) throw new Error("Failed to update staff credentials");
    return response.json();
  }
};