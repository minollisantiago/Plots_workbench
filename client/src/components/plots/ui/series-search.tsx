import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList, CommandItem } from "@/components/ui/command"

interface SeriesOption {
  id: string
  label: string
  subLabel?: string
  group?: string
}

interface Props {
  triggerLabel?: string
  searchPlaceholder?: string
  emptyPlaceholder?: string
  options: SeriesOption[]
  onSelect: (series: SeriesOption) => void
}

export const SeriesSearch = ({
  triggerLabel = "Add series",
  searchPlaceholder = "Find series",
  emptyPlaceholder = "No results found.",
  options, onSelect
}: Props) => {

  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="flex justify-start w-full bg-muted rounded-lg hover:bg-muted">
          <Plus className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground text-sm">{triggerLabel}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[var(--radix-popover-trigger-width)] border-0" align="center">
        <Command className="rounded-lg border border-b-1">
          <CommandInput className="border-0 focus-visible:ring-transparent" placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
            <CommandGroup heading="Series">
              {options.map((series) => (
                <CommandItem
                  key={series.id}
                  onSelect={() => {
                    onSelect(series)
                    setOpen(false)
                  }}
                >
                  <div className="flex flex-row justify-between w-full">
                    <span>{series.label}</span>
                    {series.subLabel && <span className="text-sm text-muted-foreground">{series.subLabel}</span>}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

