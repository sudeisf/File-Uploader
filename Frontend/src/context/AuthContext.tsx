import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchAuthStatus = async (): Promise<{
  data: any; success: boolean 
}> => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/Protected`, {
    withCredentials: true,
  });
  return response.data;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    return storedIsLoggedIn === "true";
  });

 
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetchAuthStatus();
        const data = response.data;
        setIsLoggedIn(data.success);
        localStorage.setItem("isLoggedIn", String(data.success));
      } catch (error) {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
      }
    };

    
    if (isLoggedIn === undefined) {
      checkAuthStatus();
    }
  }, []); 

  const logout = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        withCredentials: true,
      });
      const data = response.data;
      if (data.success) {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { useAuth };
