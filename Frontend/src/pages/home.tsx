
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Uploader from "@/components/Uploader/Uploader"
import Folder from "@/pages/Folders"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Target } from "lucide-react";
import { useState } from "react";






export default function Home() {
  const savedTab = localStorage.getItem("selecetedTab") || "upload";
  const [folderName, setFolderName] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleTabChange = (value: string) => {
    localStorage.setItem("selecetedTab", value);
  };

  const createFolderHandler = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${API_URL}/api/folders/create-folder`, {
        name: folderName 
      }, {
        withCredentials: true,
      })
      
      if (res.status === 200) {
        setIsLoading(false)
        toast({
          title: "Success",
          description: 'Folder created successfully',
          variant: "default",
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: 'An error occurred',
        variant: "destructive",
      })
    }finally{
      setIsLoading(false)
    }
  }


  return (
    <Tabs
     defaultValue={savedTab}
     onValueChange={handleTabChange}
      className="w-[90%] max-w-[900px] mx-auto mt-10">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload" className="uppercase">Upload</TabsTrigger>
        <TabsTrigger value="Folders">Folders</TabsTrigger>
      </TabsList>
      <TabsContent value="upload">
        <Uploader />
      </TabsContent>


      <TabsContent value="Folders" className="flex">
        <Card className="w-[60%] border-none shadow-none rounded-none ">
          <CardHeader>
            <CardTitle>Folders</CardTitle>
            <CardDescription>
            create folders and store your files 
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-1"> 
            <QueryClientProvider client={queryClient as unknown as QueryClient}>
             <Folder />
              </QueryClientProvider>                 
          </CardContent>

         
        </Card>
        <Card className="w-[40%] border-none shadow-none">
          <CardHeader>
            <CardTitle>Create New Folder</CardTitle>
            <CardDescription>
            create a new folder to organize your files 
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input name="folderName" onChange={(e)=>setFolderName(e.target.value)} type="text" placeholder="Folder Name" className="w-full py-1 px-4 rounded-md border-gray-300 border-2 focus:outline-none" />
          </CardContent>
          <CardFooter className="flex items-center justify-end">
            <button 
            onClick={createFolderHandler}
            className="w-full h-8 rounded-md text-[.9rem] font-Rubic text-white bg-black hover:bg-gray-700">
              {
                isLoading ? 'Creating...' : 'Create'
              }
            </button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
