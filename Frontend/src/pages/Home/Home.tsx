import { Input } from "@/components/ui/input";


const Home = () => {
    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-cyan-700">Home</h1>
            <form action="">
                <Input type="file" name="file" className="h-80" />
                <img src="" alt="was image here" />

            </form>
        </div>
    )
}


export  default Home;