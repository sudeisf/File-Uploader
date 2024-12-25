import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import{
    Form,
    FormItem,
    FormControl,
    FormDescription,
    FormField,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import uploadIcon from "@/assets/icons/upload.svg";
import { useState } from "react";
import jpeg from "@/assets/icons/jpg-svgrepo-com.svg";
import remove from "@/assets/icons/remove.svg";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { finished } from "stream";


const fileLimit = 2 * 1024 * 1024; // MB

const formSchema =z.object({file: z.instanceof(File)
.refine((file)=>{
    [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.oasis.opendocument.text",
        "text/plain",
        "application/vnd.oasis.opendocument.presentation",
        "application/vnd.oasis.opendocument.spreadsheet",
        "application/vnd.oasis.opendocument.graphics",
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/webp",
        "image/svg+xml"
    ].includes(file.type), {
        message: "Invalid file type"
    }
}).refine((file) => file.size <= fileLimit, {
    message: "File size too large"
})
});


const Home = () => {
    const [file, setFile] = useState<File | null>(null);

    const form  = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    async function onSubmit(data: { file: File }) {
        try{
            const API = import.meta.env.VITE_API_URL;
            const respose = await axios.post(`${API}/f/files`, data.file); //not finished
            console.log(respose.data); 

        }catch(err){
            console.error(err);

        }
    }
    function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
          console.log("Selected file:", file);
        }
      }
      
    return (
        <div>
        <h1 className="text-2xl font-bold text-center mb-5 uppercase">Upload a file</h1>
        
       <Form {...form}>
        <form className='flex flex-col items-start min-w-sm max-w-2xl mx-auto
            '
          onSubmit={form.handleSubmit(onSubmit)}
         >  
         <FormField
          control={form.control}    
          name="file" 
          render={({ field }) => (   
            <FormItem className='flex flex-col items-center drop-shadow-sm border-[3px] border-dotted border-gray-300 p-4 w-full text-white rounded-lg'>
              <FormLabel className='text-start font-bold space-y-4 py-8 flex flex-col items-center text-black cursor-pointer'>
              <img src={uploadIcon} alt="" className="w-20"/>
                <h1 className="text-2xl font-semibold text-center">Create or Import a custom Document</h1>
                <div 
                className="flex flex-col items-center max-w-md space-y-2">
                    <p className="text-md font-normal ">Minimum file size: 2MB</p>
                    <p className="text-md font-normal  capitalize">supports : images and documents</p>
                </div>
                 </FormLabel>
              <FormControl> 
                <Input     
                  type="file"
                  onChange={(e) => field.onChange(onFileChange(e))}
                  className="hidden"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </form>
       </Form>

          <div  className='flex flex-col items-start min-w-sm max-w-2xl mx-auto ' >
              <h1 className=" py-2 text-xl font-normal mt-4  w-full text-start drop-shadow-sm">Progress</h1>
                {
                    file && (
                        <div className="flex flex-col items-start w-full">
                        <div className="flex justify-between items-center border-[1px] mt-4 rounded-lg w-full group">
                            <div className="text-md flex space-x-4 p-4 items-start text-start">
                                <div className="my-auto">
                                    <img src={jpeg} alt="type-image" className="w-10" />
                                </div>
                    
                                <div className="flex flex-col space-y-1">
                                    <h1 className="text-sm font-semibold p-0">{file.name}</h1>
                                    <div className="flex items-center max-w-md space-x-4">
                                        <p className="text-sm font-normal uppercase">{file.type.split('/')[1]}</p>
                                        <p className="text-md font-normal">{(file.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                </div>
                            </div>
                            <div
                                onClick={() => setFile(null)}
                                className=" items-center hidden group-hover:flex p-3 mr-4 cursor-pointer transition duration-200 ease-in-out border-2   rounded-[50%]  hover:text-white"
                            >
                                <img
                                    src={remove}
                                    alt=""
                                    className="w-3 transition  duration-200 ease-in-out hidden group-hover:scale-110 group-hover:block"
                                />
                            </div>
                        </div>
                    </div>
                    )
                }
                {
                    file && (
                        <Button
                        onClick={() => form.handleSubmit(onSubmit)()}
                        className="bg-cyan-600 hover:bg-cyan-700 mt-4 w-full"
                    >
                        Upload
                    </Button>
                    )
                }
                
          </div>

           

        </div>
    )
}


export  default Home;