import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const queryClient = new QueryClient();

const fetchAuthStatus = async (): Promise<{ success: boolean }> => {
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

  const { data } = useQuery("authStatus", fetchAuthStatus, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    onSuccess: (data) => {
      setIsLoggedIn(data.success);
      localStorage.setItem("isLoggedIn", String(data.success));
    },
    onError: () => {
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn");
    },
  });

  const logout = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        withCredentials: true,
      });
      const data = response.data;
      if (data.success) {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
        queryClient.invalidateQueries("authStatus");
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

export { useAuth, QueryClientProvider, queryClient };
