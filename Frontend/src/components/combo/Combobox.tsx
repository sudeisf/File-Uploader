import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
] as const;

const FormSchema = z.object({
  folder: z.string().min(1, "Please select a folder."),
});

interface ComboboxProps {
  onFolderSelect: (folder: string) => void;
  isFolderThere: boolean;
}

export default function Combobox({ onFolderSelect, isFolderThere }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { folder: "" },
  });

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="folder"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 pl-3">
              <FormLabel className="font-Rubic font-bold text-[.9rem] text-black pt-2">
                Select Folder
              </FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[170px] h-8 justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isFolderThere}
                    >
                      {field.value
                        ? Folders.find((folder) => folder.value === field.value)?.label
                        : "Folders"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search folder..." />
                    <CommandList>
                      <CommandEmpty>No folder found.</CommandEmpty>
                      <CommandGroup>
                        {Folders.map((folder) => (
                          <CommandItem
                            value={folder.label}
                            key={folder.value}
                            onSelect={() => {
                              field.onChange(folder.value);
                              onFolderSelect(folder.value);
                              setOpen(false);
                            }}
                          >
                            {folder.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                folder.value === field.value ? "opacity-100" : "opacity-0"
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
      <p className="text-sm font-Rubic text-[#756E6E] font-light flex mt-4 w-[90%] mx-auto">
        After you select a folder, click the upload button.
      </p>
    </Form>
  );
}
