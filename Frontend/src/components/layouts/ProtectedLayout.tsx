import { useAuth } from "@/context/AuthContext"
import { Navigate , Outlet } from "react-router-dom";


export default function ProtectedLayout()  {
    const {isLoggedIn} = useAuth();
    console.log(isLoggedIn);
    return (
        <>
            {isLoggedIn && (
                <>
                    <Outlet />
                </>
            )}
            {!isLoggedIn && (
                <>
                    <Navigate to="/login" />
                </>
            )}
        </>
    )
}