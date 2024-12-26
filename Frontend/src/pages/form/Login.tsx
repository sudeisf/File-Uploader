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
    username: z.string().min(3,{
        message: "Username must be at least 3 characters long"
    }),
    password: z.string().min(6),
})

const Login = () => {
    
    const Navigate = useNavigate();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // Correctly access the environment variable
            const API_URL = import.meta.env.VITE_API_URL;
            // Send POST request to the login endpoint
            const response = await axios.post(`${API_URL}/api/auth/login`, values, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            if(response.data.success === true){
                toast({
                    title: "Success",
                    description: "Login successful",
                    variant: "default",
                })
                Navigate('/Home');
            }
      
            console.log(response.data);
    
        } catch (err: any) {
            // Log any errors
            console.log(err);
            toast({
                title: "Error",
                description: `${err?.response?.data.message || 'An error occurred'}`,
                variant: "destructive",
            })
        }
    }
    



    return (
        <div className='mx-auto max-w-sm mt-10 font-mono'>
       <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col ">
        <h1
        className='text-2xl font-bold text-center'
        >Login</h1>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className='flex flex-col items-start'>
              <FormLabel className='text-start font-bold text-lg text-cyan-700'>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
                <FormItem  className='flex flex-col items-start'>
                    <FormLabel className='text-start font-bold text-lg text-cyan-700'>Password</FormLabel>
                    <FormControl>
                        <Input placeholder="password" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        
        />
        <Button type="submit" className='bg-cyan-600 hover:bg-cyan-700'>Submit</Button>
        <p>
            <Link to="/Form/Register">dont have an account? <span className='font-bold text-cyan-600 '> Register</span></Link>
        </p>
      </form>
    </Form>
     </div>
    )



}


export default Login;