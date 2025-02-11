import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import file from '@/assets/pngIcon.svg';
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
import { Download, EllipsisVertical, Folder, Share, Trash } from "lucide-react";


import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"




export default function Home() {
  return (
    <Tabs defaultValue="upload" className="w-[90%] max-w-[900px] mx-auto mt-10">
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
          <CardContent className="space-y-2">
                              
            <Accordion type="single" collapsible className="w-full space-y-2">
              <AccordionItem value="item-1">
                <AccordionTrigger className="border-2 p-4 rounded-md border-black" >
                  <div className="flex gap-2 items-center">
                    <Folder className="w-5 h-5" /> 
                    <h3>Folder name</h3>
                  </div>
                  
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 pl-4 pt-2">
                  <div className="w-[90%] bg-[#d3d0d01f] text-white px-1 pl-2 rounded-lg flex items-center justify-between shadow-sm">
                    <div className="flex text-black gap-2 items-center p-2 "> 
                       <img src={file} alt="folder" className="w-8" />
                       <div>
                        <h4 className="font-bold">File Name</h4>
                        <p className="text-[#787070]">size :100kb</p>
                       </div>
                    </div>

                    <Menubar className="text-black bg-none border-none shadow-none bg-[#f2ecec00] ">
                        <MenubarMenu>
                          <MenubarTrigger>
                          <EllipsisVertical className="w-3 " />
                          </MenubarTrigger>
                          <MenubarContent className="flex flex-col">
                            <MenubarItem className="flex items-center gap-3"><Share  className="w-4"/> Share</MenubarItem>
                            <MenubarItem className="text-red-700 flex items-center gap-3"><Trash className="w-4" />Delete</MenubarItem>
                            <MenubarItem className="flex items-center gap-3"> <Download className="w-4 h-5"/> Download</MenubarItem>
                          </MenubarContent>
                        </MenubarMenu>
                      </Menubar>
                  </div>
                </AccordionContent>
              </AccordionItem>


              <AccordionItem value="item-2">
                <AccordionTrigger className="border-2 p-4 rounded-md border-black" >
                  <div className="flex gap-2 items-center">
                    <Folder className="w-5 h-5" /> 
                    <h3>Folder name</h3>
                  </div>
                  
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 pl-4 pt-2">
                  <div className="w-[90%] bg-[#d3d0d01f] text-white px-1 pl-2 rounded-lg flex items-center justify-between shadow-sm">
                    <div className="flex text-black gap-2 items-center p-2 "> 
                       <img src={file} alt="folder" className="w-8" />
                       <div>
                        <h4 className="font-bold">File Name</h4>
                        <p className="text-[#787070]">size :100kb</p>
                       </div>
                    </div>

                    <Menubar className="text-black bg-none border-none shadow-none bg-[#f2ecec00] ">
                        <MenubarMenu>
                          <MenubarTrigger>
                          <EllipsisVertical className="w-3 " />
                          </MenubarTrigger>
                          <MenubarContent className="flex flex-col">
                            <MenubarItem className="flex items-center gap-3"><Share  className="w-4"/> Share</MenubarItem>
                            <MenubarItem className="text-red-700 flex items-center gap-3"><Trash className="w-4" />Delete</MenubarItem>
                            <MenubarItem className="flex items-center gap-3"> <Download className="w-4 h-5"/> Download</MenubarItem>
                          </MenubarContent>
                        </MenubarMenu>
                      </Menubar>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="border-2 p-4 rounded-md border-black" >
                  <div className="flex gap-2 items-center">
                    <Folder className="w-5 h-5" /> 
                    <h3>Folder name</h3>
                  </div>
                  
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 pl-4 pt-2">
                  <div className="w-[90%] bg-[#d3d0d01f] text-white px-1 pl-2 rounded-lg flex items-center justify-between shadow-sm">
                    <div className="flex text-black gap-2 items-center p-2 "> 
                       <img src={file} alt="folder" className="w-8" />
                       <div>
                        <h4 className="font-bold">File Name</h4>
                        <p className="text-[#787070]">size :100kb</p>
                       </div>
                    </div>

                    <Menubar className="text-black bg-none border-none shadow-none bg-[#f2ecec00] ">
                        <MenubarMenu>
                          <MenubarTrigger>
                          <EllipsisVertical className="w-3 " />
                          </MenubarTrigger>
                          <MenubarContent className="flex flex-col">
                            <MenubarItem className="flex items-center gap-3"><Share  className="w-4"/> Share</MenubarItem>
                            <MenubarItem className="text-red-700 flex items-center gap-3"><Trash className="w-4" />Delete</MenubarItem>
                            <MenubarItem className="flex items-center gap-3"> <Download className="w-4 h-5"/> Download</MenubarItem>
                          </MenubarContent>
                        </MenubarMenu>
                      </Menubar>
                  </div>
                </AccordionContent>
              </AccordionItem>

             
            </Accordion>

          </CardContent>
          <CardFooter>
            
          </CardFooter>
        </Card>
        <Card className="w-[40%] border-none shadow-none">
          <CardHeader>
            <CardTitle>Create New Folder</CardTitle>
            <CardDescription>
            create a new folder to organize your files 
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input type="text" placeholder="Folder Name" className="w-full py-3 px-4 rounded-md border-gray-300 border-2 focus:outline-none" />
          </CardContent>
          <CardFooter className="flex items-center justify-end">
            <button className="w-20 h-8 rounded-md text-[.9rem] font-Rubic text-black bg-gray-200 hover:bg-gray-300">Create</button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
