const API_URL = "http://localhost:8081/api/users";

export const userService = {
  register: async (userData: any) => {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Registration failed");
    }
    return response.json();
  },

  // Note: For now, login will just be a simulation until we add Spring Security
  login: async (credentials: any) => {
    console.log("Logging in with:", credentials);
    return { success: true }; 
  }
};