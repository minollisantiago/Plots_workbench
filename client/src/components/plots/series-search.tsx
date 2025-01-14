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
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Command className="rounded-xl border shadow-md">
      <CommandInput
        placeholder={placeholder}
        onFocus={() => setIsOpen(true)}
        onBlur={() => { setTimeout(() => setIsOpen(false), 200) }}
        className="border-0"
      />
      {isOpen && (

        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {options.map((series) => (
              <CommandItem
                key={series.id}
                onSelect={() => {
                  onSelect(series)
                  setIsOpen(false)
                }}
              >
                <div className="flex flex-col">
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
