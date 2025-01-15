import { useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList, CommandItem } from "@/components/ui/command"

interface SeriesOption {
  id: string
  label: string
  subLabel: string
  group?: string
}

interface SeriesSearchProps {
  placeholder?: string
  options: SeriesOption[]
  onSelect: (series: SeriesOption) => void
}

const SeriesSearch = ({ placeholder = "Find series", options, onSelect }: SeriesSearchProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Command className="rounded-lg border border-b-1">
      <CommandInput
        className="border-0 focus-visible:ring-0"
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onBlur={() => { setTimeout(() => setOpen(false), 200) }}
      />
      {open && (

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
      )}
    </Command>
  )
}

export default SeriesSearch
