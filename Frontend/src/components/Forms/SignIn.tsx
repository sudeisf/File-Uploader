import { Input } from "../ui/input"
import { Button } from "../ui/button"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
import { Form , FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"


const formSchema = z.object({
    username: z.string().min(3),
    email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    password: z.string().min(6),
})


export default function Register() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })


    function onSubmit(values: z.infer<typeof formSchema>) { 
        console.log(values)
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-[400px] mx-auto mt-28 p-5 border-2 rounded-lg shadow-md ">
              <h1 className="text-3xl font-bold capitalize">Sign Up</h1>
               <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Sign In</Button>
                <div className="flex justify-center gap-2">
                    <p className="text-center">have an account?</p>
                     <a href="/login">Login</a>
                </div>
            </form>
        </Form>
    )
}