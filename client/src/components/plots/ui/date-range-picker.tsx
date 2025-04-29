import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  numberOfMonths: number;
  dateRange?: DateRange | undefined;
  onDateRangeChange?: (range: DateRange | undefined) => void;
};
export const DateRangePicker = ({ numberOfMonths = 2, dateRange = undefined, onDateRangeChange }: Props) => {

  const today = new Date();
  const defaultStartMonth = new Date(today);
  defaultStartMonth.setMonth(today.getMonth() - numberOfMonths + 1);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-8 w-10 rounded-lg">
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="end">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={defaultStartMonth}
          selected={dateRange}
          onSelect={onDateRangeChange}
          numberOfMonths={numberOfMonths}
          toDate={new Date()}
        />
      </PopoverContent>
    </Popover>
  )
}
