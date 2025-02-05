import { cn } from "@/lib/utils"
import { useState } from "react";
import { Button } from "@/components/ui/button";

export type TimePeriod = string

interface Props {
  periods: TimePeriod[]
  defaultSelected?: TimePeriod
  onSelect?: (period: TimePeriod) => void
}

export const TimePeriodSelector = ({ periods, defaultSelected, onSelect }: Props) => {
  const [selected, setSelected] = useState<TimePeriod>(defaultSelected ?? periods[0])

  const handleSelect = (period: TimePeriod) => {
    setSelected(period)
    onSelect?.(period)
  }

  return (
    <div className="flex gap-2 p-2 bg-background/95">
      {periods.map((period) => (
        <Button
          key={period}
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-10 px-2 rounded-md text-sm text-muted-foreground",
            selected === period
              ? "text-muted-foreground bg-zinc-900 hover:bg-zinc-900 hover:text-muted-foreground"
              : "hover:bg-muted"
          )}
          onClick={() => handleSelect(period)}
        >
          {period}
        </Button>
      ))}

    </div>
  )
}

