import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import publicicon from '@/assets/folder-link-svgrepo-com.svg'
import { Label } from "@/components/ui/label"
import add from '@/assets/add-ellipse-svgrepo-com.svg'
import Combobox  from "../combo/Combobox"
// import { Separator } from "@radix-ui/react-separator"

export default function CreateFolder() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button  className="justify-end">
            <img src={add} alt="add btn" className="w-5"/>
            upload</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-black text-2xl font-semibold font-Rubic mb-4">Upload File</DialogTitle>
          <DialogDescription >
          <p className="text-lg text-[#756E6E] flex mb-2">Upload to public Folder  by default
            <span className="text-black flex ml-2 text-[.9rem] font-bold font-Rubic items-center  justify-center space-x-5"> <img src={publicicon} alt="" className="w-6 capitalize items-center mr-1"/>public</span>
            </p>
          </DialogDescription>
        </DialogHeader>
        <Button type="submit" className="w-[95%] mx-auto h-8 rounded-sm text-[.9rem] font-Rubic">Upload</Button>

        <div className="flex items-center justify-center space-x-4 mt-4">
        <div className="w-[40%] h-[.05rem] bg-black"></div>
          <h1>or</h1>
          <div className="w-[40%] h-[.05rem] bg-black"></div>
        </div>
          <div>
              <Combobox />
          </div>
          <div className="flex flex-col items-center justify-center space-y-4 mt-4">
            <p className="text-md text-black font-bold font-Rubic mx-auto w-[90%]">If you want to add folder you can create one</p>
            <div className="flex items-center ml-3 space-x-4 mt-2 w-full ">
              <Label className="text-black text-sm font-Rubic font-semibold">Folder name</Label>
              <Input 
                  className="w-[150px] mx-auto h-8 rounded-sm placeholder:text-xs placeholder:text-gray-400 font-rubik text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Enter folder name" 
                />

              <Button className="w-[95px] h-8 rounded-sm text-[.9rem] font-Rubic">Create</Button>
            </div>
            <p className="text-sm text-[#756E6E] font-medium font-Rubic w-[90%]">After you create folder click the upload button</p>
          </div>
        <DialogFooter>
         
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
