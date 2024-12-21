import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const Home = () => {
    return (
        <div className="max-w-md mx-auto space-y-4">
            <h1 className="text-2xl font-bold mb-4 text-cyan-700 capitalize">Uplod your files</h1> 
            <p className="text-lg text-muted-foreground font-semibold font-mono">you can upload your files here</p>
            <Button className="w-full bg-cyan-700">Upload</Button>
        </div>
    )
}


export  default Home;