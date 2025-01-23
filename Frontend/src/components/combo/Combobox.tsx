

import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Form,
  FormControl,

  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const Folders = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const

const FormSchema = z.object({
  folder: z.string({
    required_error: "Please select a folder.",
  }),
})

export default function Combobox() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

//   function onSubmit(data: z.infer<typeof FormSchema>) {
    
//   }

  return (
    <Form {...form}>
      <form  className="space-y-6">
        <FormField
          control={form.control}
          name="folder"
          render={({ field }) => (
            <FormItem className="flex  items-center space-x-2 pl-3">
              <FormLabel className="font-Rubic font-bold text-[.9rem] text-black pt-2">Select Folder</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl className="items-center">
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[170px] h-8 justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? Folders.find(
                            (folder) => folder.value === field.value
                          )?.label
                        : "Folders"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>

                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandList>
                      <CommandEmpty>No folder found.</CommandEmpty>
                      <CommandGroup>
                        {Folders.map((folder) => (
                          <CommandItem
                            value={folder.label}
                            key={folder.value}
                            onSelect={() => {
                              form.setValue("folder", folder.value)
                            }}
                          >
                            {folder.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                folder.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              <FormMessage />
            </FormItem>
           
          )}
        />
        
      
      </form>
      <p className="text-sm font-Rubic text-[#756E6E] font-light flex mt-4  w-[90%] mx-auto">
                  After you select folder click the upload button
              </p>
    </Form>
  )
}
