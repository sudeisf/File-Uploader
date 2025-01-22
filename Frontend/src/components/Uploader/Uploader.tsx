import { useRef, useState } from "react";
import { Input } from "../ui/input"
import uploder from '@/assets/uploader.svg'
import {z} from "zod"
import { toast } from "@/hooks/use-toast";
import svg from '@/assets/svg-svgrepo-com.svg'
import docx from '@/assets/docx-file-format-symbol-svgrepo-com.svg'
import pptx from '@/assets/ppt-svgrepo-com.svg'
import png from '@/assets/png-file-type-svgrepo-com.svg'
import jpg from '@/assets/jpeg-svgrepo-com.svg'
import cance from '@/assets/remove-circle-svgrepo-com.svg'
import { Button } from "../ui/button";




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


const setFileIconFunction = (file: File): string | undefined => {
  const fileTypes = {
    "image/jpeg": jpg,
    "image/png": png,
    "image/svg+xml": svg,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": docx,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": pptx
  };

  return fileTypes[file.type as keyof typeof fileTypes];
}


export default function Uploader() {
    const [file, setFile] = useState<File | null>(null);
    const [fileIcon, setFileIcon] = useState<string | undefined>(undefined);
    const fileInputref = useRef<HTMLInputElement>(null);
    const handleFileUpload = () => {
        if (fileInputref.current) {
          fileInputref.current.click();
        }
      };
      const handleCancel = () => {
        setFile(null);
        setFileIcon(undefined);
        if (fileInputref.current) {
          fileInputref.current.value = "";
        }
      };
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        const icon = setFileIconFunction(selectedFile);
        setFileIcon(icon || undefined);
        console.log(selectedFile);
    
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
        <div className="w-full h-full max-h-[600px]
         bg-gray-100 pt-8 rounded-lg border-2 shadow-sm">

          <div className="relative w-[90%] mx-auto mb-4 bg-white rounded-xl border-dotted border-[.2rem] border-[#bebdbd] "
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
                  <div className="w-[90%] mx-auto">
                     <div className="flex items-center justify-between bg-white  mx-auto mt-4 mb-5 py-4 px-8 rounded-xl border-2 shadow-sm group ">

                      <div className="flex">
                        
                        <div className="flex items-center ">
                            <img src={fileIcon} alt="File icon" className="w-10 h-10" />
                        </div>

                        <div className="flex flex-col ml-4">
                          <p className="text-md font-sans">{file.name}</p>
                            <p className="text-sm text-gray-500">
                                  {file.size < 1024
                                    ? `${file.size} bytes`
                                    : file.size < 1024 * 1024
                                    ? `${(file.size / 1024).toFixed(2)} KB`
                                    : `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                            </p>
                          </div>
                      </div>

                      <div className="hidden group-hover:block">
                        <button
                          className="text-red-500 capitalize items-center flex  flex-col text-[0.8rem]"
                          onClick={(e) => {
                            e.stopPropagation(); 
                            handleCancel();
                          }}
                        >
                          <img src={cance} alt="cancel icon" className="w-6 h-6" />
                          
                        </button>
                      </div>
                      </div>

                      <Button 
                      className="w-full mx-auto mt-2 mb-5 py-4">Upload</Button>
                  </div>
                   
                )
            }
          </div>
          
        </div>
    )
}