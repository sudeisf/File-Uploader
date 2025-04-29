
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

  import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
  } from "@/components/ui/menubar"
import { Download, EllipsisVertical, Folder, Share, Trash } from "lucide-react";
import svg from "@/assets/svg-svgrepo-com.svg";
import docx from "@/assets/docx-file-format-symbol-svgrepo-com.svg";
import pptx from "@/assets/ppt-svgrepo-com.svg";
import png from "@/assets/png-file-type-svgrepo-com.svg";
import jpg from "@/assets/jpeg-svgrepo-com.svg";

import { Key, useEffect , useState } from "react";
import { useFolder } from "@/hooks/useFolder";



export default function Folders() {
    interface Folder {
      name: string;
      files: { name: string; metadata: {
          mimetype: string; size: number 
} }[];
    }
    const {data,isLoading,error} = useFolder();
    
    console.log(data);
    const setFileIconFunction = (file: { name: string; type: string }): string | undefined => {
        const fileTypes: Record<string, string> = {
          "image/jpeg": jpg,
          "image/png": png,
          "image/svg+xml": svg,
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document": docx,
          "application/vnd.openxmlformats-officedocument.presentationml.presentation": pptx,
        };
        return fileTypes[file.type];
      };

      const formatFileSize = (size: number): string => {
        if (size >= 1024 * 1024) {
          return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        } else if (size >= 1024) {
          return `${(size / 1024).toFixed(2)} KB`;
        }
        return `${size} Bytes`;
      };
      
  
    return (
      <>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {data?.map((folder: Folder, index: Key | null | undefined)  => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="border-2 p-4 rounded-md border-black">
                  <div className="flex gap-2 items-center">
                    <Folder className="w-5 h-5" />
                    <h3>{folder.name}</h3>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 pl-4 pt-2">
                  {folder.files.map((file, i) => (
                    <div key={i} className="w-[90%] bg-[#d3d0d01f] text-white px-1 pl-2 rounded-lg flex items-center justify-between shadow-sm">
                      <div className="flex text-black gap-2 items-center p-2">
                        <img
                        src={setFileIconFunction({
                            name: file.name, type: file.metadata.mimetype})}
                        alt="file" className="w-8" />
                        <div>
                          <h4 className="font-bold">{file.name}</h4>
                          <p className="text-[#787070]">{formatFileSize(file.metadata.size)}</p>
                        </div>
                      </div>
  
                      <Menubar className="text-black bg-none border-none shadow-none">
                        <MenubarMenu>
                          <MenubarTrigger>
                            <EllipsisVertical className="w-3" />
                          </MenubarTrigger>
                          <MenubarContent className="flex flex-col">
                            <MenubarItem className="flex items-center gap-3">
                              <Share className="w-4" /> Share
                            </MenubarItem>
                            <MenubarItem className="text-red-700 flex items-center gap-3">
                              <Trash className="w-4" /> Delete
                            </MenubarItem>
                            <MenubarItem className="flex items-center gap-3">
                              <Download className="w-4 h-5" /> Download
                            </MenubarItem>
                          </MenubarContent>
                        </MenubarMenu>
                      </Menubar>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </>
    );
  }
  