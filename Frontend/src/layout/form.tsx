import { Outlet } from "react-router"
import { Toaster } from "@/components/ui/toaster";


const Form  = () => {
    return (
        <>
            <Outlet/>
            <Toaster/>
            
        </>
    )
}


export default Form;