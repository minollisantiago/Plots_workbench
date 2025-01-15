import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList, CommandItem } from "@/components/ui/command"

interface SeriesOption {
  id: string
  label: string
  subLabel: string
  group?: string
}

interface SeriesSearchProps {
  placeholder?: string
  tooltip?: string
  label?: string
  options: SeriesOption[]
  onSelect: (series: SeriesOption) => void
}

const SeriesSearch = ({
  placeholder = "Find series",
  tooltip = "Click to start searching",
  label = "Add series",
  options, onSelect
}: SeriesSearchProps) => {

  const [open, setOpen] = useState(false)

  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <Popover open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button className="flex justify-start w-full bg-zinc-900 hover:bg-muted">
                <Plus className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">{label}</span>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[var(--radix-popover-trigger-width)] border-0" align="center">
            <Command className="rounded-lg border border-b-1">
              <CommandInput className="border-0 focus-visible:ring-transparent" placeholder={placeholder} />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
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
                        <span className="text-sm text-muted-foreground">{series.subLabel}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <TooltipContent className="bg-popover border" side="bottom" align="end">
          <p className="text-muted-foreground">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default SeriesSearch
