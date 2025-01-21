
import { createContext, useState } from "react";
import axios from "axios";
import React from "react";


type AuthContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    logout: () => void;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const Logout = async () => {
        try{
            const API_URL =  import.meta.env.VITE_API_URL;
            const respose  = await axios.get(`${API_URL}/api/auth/logout` ,{withCredentials: true});
            const data =  respose.data;
            if(data.success) {
                setIsLoggedIn(false);
            }
        }catch(e: any){
            console.log(e)
        }
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout: Logout }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
}

export { useAuth };