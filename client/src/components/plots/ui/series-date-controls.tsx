import { cn } from "@/lib/utils"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DateRangePicker } from "@/components/plots/ui";

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
    <div className="flex gap-2 bg-background/95">
      <div className="flex gap-2 center items-center">
        {periods.map((period) => (
          <Button
            key={period}
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-10 px-2 rounded-md text-sm text-muted-foreground",
              selected === period
                ? "text-muted-foreground bg-muted hover:bg-muted hover:text-muted-foreground"
                : "hover:bg-muted"
            )}
            onClick={() => handleSelect(period)}
          >
            {period}
          </Button>
        ))}
      </div>
      <Separator orientation="vertical" />
      <DateRangePicker numberOfMonths={3} />
    </div>
  )
}

