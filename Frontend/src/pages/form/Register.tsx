
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import axios from 'axios'
import { toast } from '@/hooks/use-toast'
import { Link, useNavigate } from 'react-router-dom'



const formSchema = z.object({
    username: z.string().min(3, {
        message: "Username must be at least 3 characters long",
    }),
    password: z.string().min(6),
    email: z.string().email(),
})

const Register = () => {

    const nav = useNavigate();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            email: "",
        },
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {
        try{
            const API = import.meta.env.VITE_API_URL;
            const response = await axios.post(`${API}/api/v1/register`, values, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            if(response.data.success === true){
                nav('/Form/Login');
                toast({
                    title: "Success",
                    description: "Registration successful",
                    variant: "default",
                })
            }

        }catch(err){
            console.error(err);
            toast({
                title: "Error",
                description: "Registration failed",
                variant: "destructive",
            })
        }
    }


    return (
        <div className='mx-auto max-w-sm mt-10 font-mono'>
            <h1 className='text-2xl font-bold mb-4'>Register</h1>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col w-full">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className='flex flex-col items-start'>
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
                        <FormItem className='flex flex-col items-start'>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField  
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className='flex flex-col items-start'>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className='bg-cyan-600 hover:bg-cyan-700'>Submit</Button>  
                <p>
                    Already have an account?{' '}
                    <Link to="/Form/Login">Login</Link>
                </p>
                      
            </form>
        </Form>
        </div>
    )
}

export default Register;