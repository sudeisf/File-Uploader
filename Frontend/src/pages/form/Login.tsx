import {
    Form,
    FormControl,
    FormDescription,
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


const formSchema = z.object({
    username: z.string().min(3,{
        message: "Username must be at least 3 characters long"
    }),
    password: z.string().min(6),
})

const Login = () => {
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
            const response = await axios.post(`${API_URL}/auth/login`, values, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true, // Correct property to allow credentials
            });
            if(response.data.success){
                toast({
                    title: "Success",
                    description: "Login successful",
                    variant: "default",
                })
            }
    
            // Log the response data
            console.log(response.data);
    
        } catch (err) {
            // Log any errors
            console.error(err);
            toast({
                title: "Error",
                description: "Login failed",
                variant: "destructive",
            })
        }
    }
    



    return (
        <div className='mx-auto max-w-sm mt-10'>
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
              <FormLabel>Username</FormLabel>
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input placeholder="password" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
     </div>
    )



}


export default Login;