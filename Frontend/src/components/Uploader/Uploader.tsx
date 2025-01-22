import { useRef, useState } from "react";
import { Input } from "../ui/input"
import uploder from '@/assets/uploader.svg'
import {z} from "zod"
import { toast } from "@/hooks/use-toast";




// Define the Zod schema for file validation
const formSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size < 2 * 1024 * 1024, {
      message: "File size must be less than 2MB",
    })
    .refine((file) => {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/svg+xml",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ];

      // Check if the file type is valid
      return validTypes.includes(file.type);
    }, {
      message: "File must be an image (JPG, PNG, SVG), DOCX, or PPTX", // Validation message
    }),
});


export default function Uploader() {
    const [file, setFile] = useState<File | null>(null);
    const fileInputref = useRef<HTMLInputElement>(null);
    const handleFileUpload = () => {
        if (fileInputref.current) {
          fileInputref.current.click();
        }
      };
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
    
        // Perform Zod validation
        try {
          formSchema.parse({ file: selectedFile });
          setFile(selectedFile);
          toast({
            title: "Success",
            description: `${selectedFile.name} uploaded successfully`,
            variant: "default",
          });
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.errors[0].message,
            variant: "destructive",
          });
        }
      };
    return (
        <div className="w-full h-[600px] bg-gray-100 pt-8 rounded-lg border-2 shadow-sm">

          <div className="relative w-[600px] mx-auto bg-white rounded-xl border-dotted border-[.2rem] border-[#bebdbd] "
                onClick={handleFileUpload}>
                <div className="flex flex-col items-center h-[300px] ">
                    <img src={uploder} alt="uploader" className="mx-auto my-10 w-20 h-20 " />
                    <p>Drag and drop a file or click to upload</p>
                    <p>file limit 2mb</p>
                </div>
                <Input 
                    ref={fileInputref} 
                    type="file" 
                    onChange={handleFileChange}  
                    className=" hidden w-full  cursor-pointer"  />
            </div>

          <div>
            {
                file && (
                    <div className="flex items-center gap-2 bg-white w-[600px] mx-auto mt-4 py-5 rounded-xl border-2 shadow-sm">
                        <p className="text-sm ml-2">{file.name}</p>
                    </div>
                )
            }
          </div>
          
        </div>
    )
}