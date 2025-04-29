import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DateRangePicker } from "@/components/plots/ui";
import { TimePeriod } from "@/components/plots/models";

interface Props {
  periods: TimePeriod[];
  selectedPeriod: TimePeriod;
  selectedDateRange?: DateRange | undefined;
  onPeriodSelect?: (period: TimePeriod) => void;
  onDateRangeSelect?: (range: DateRange | undefined) => void;
};
export const TimePeriodSelector = ({
  periods, selectedPeriod, selectedDateRange, onPeriodSelect, onDateRangeSelect
}: Props) => {

  return (
    <div className="flex gap-2 bg-background/95">
      <div className="flex gap-2 center items-center">
        {periods.map((period) => (
          <Button
            key={period.label}
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-10 px-2 rounded-lg text-sm text-muted-foreground",
              selectedPeriod.label === period.label
                ? "text-muted-foreground bg-primary-foreground hover:bg-muted hover:text-muted-foreground"
                : "hover:bg-muted"
            )}
            onClick={() => onPeriodSelect?.(period)}
          >
            {period.label}
          </Button>
        ))}
      </div>
      <Separator orientation="vertical" />
      <DateRangePicker
        numberOfMonths={3}
        dateRange={selectedDateRange}
        onDateRangeChange={onDateRangeSelect}
      />
    </div>
  )
}

