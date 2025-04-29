# 29/04/2025: TimePeriod selection improvements

### Extensible to other plot types, but focused on plot-line.tsx for now

On my plot-line component, im using a time period selector component `TimePeriodSelector`, as you can see on the context below:

<llm_context filetype="tsx" name="series-date-controls.tsx" path="/home/santiago/projects/testApps/components_workbench/client/src/components/plots/ui/series-date-controls.tsx">
```tsx
import { cn } from "@/lib/utils";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DateRangePicker } from "@/components/plots/ui";
import { TimePeriod } from "@/components/plots/models";

interface Props {
  periods: TimePeriod[];
  defaultSelected?: TimePeriod;
  onPeriodSelect?: (period: TimePeriod) =&gt; void;
  onDateRangeSelect?: (range: DateRange | undefined) =&gt; void;
};

export const TimePeriodSelector = ({ periods, defaultSelected, onPeriodSelect, onDateRangeSelect }: Props) =&gt; {
  const [selected, setSelected] = useState&lt;TimePeriod&gt;(defaultSelected ?? periods[0])

  const handlePeriodSelect = (period: TimePeriod) =&gt; {
    setSelected(period);
    onPeriodSelect?.(period);
  };

  const handleDateRangeSelect = (range: DateRange | undefined) =&gt; {
    onDateRangeSelect?.(range);
  };

  return (
    &lt;div className="flex gap-2 bg-background/95"&gt;
      &lt;div className="flex gap-2 center items-center"&gt;
        {periods.map((period) =&gt; (
          &lt;Button
            key={period.label}
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-10 px-2 rounded-lg text-sm text-muted-foreground",
              selected.label === period.label
                ? "text-muted-foreground bg-primary-foreground hover:bg-muted hover:text-muted-foreground"
                : "hover:bg-muted"
            )}
            onClick={() =&gt; handlePeriodSelect(period)}
          &gt;
            {period.label}
          &lt;/Button&gt;
        ))}
      &lt;/div&gt;
      &lt;Separator orientation="vertical" /&gt;
      &lt;DateRangePicker
        numberOfMonths={3}
        onDateRangeChange={handleDateRangeSelect}
      /&gt;
    &lt;/div&gt;
  )
}

```
Here is the `PlotLine` component code:

<llm_context filetype="tsx" name="plot-line.tsx" path="/home/santiago/projects/testApps/components_workbench/client/src/components/plots/line/plot-line.tsx">
```tsx
import { useState, useEffect, useRef } from "react";
import { useFilteredTimeSeries } from "@/hooks";
import { PlotLineFigure } from "./plot-line-figure";
import { LineControls } from "./plot-line-controls";
import { mockTimeSeriesData } from "@/data/mock/time-series-data";
import { TimePeriodSelector, CanvasHeader } from "@/components/plots/ui";
import { TimePeriod, periods, TimeSeriesData } from "@/components/plots/models";

interface Props {
  title: string;
};

// Example data
const exampleSeries: TimeSeriesData[] = mockTimeSeriesData.series;

export const PlotLine = ({ title }: Props) =&gt; {
  const [selectedSeriesIds, setSelectedSeriesIds] = useState&lt;string[]&gt;([]);
  const [hiddenSeries, setHiddenSeries] = useState&lt;Record&lt;string, boolean&gt;&gt;({});
  const [highlightedSeries, setHighlightedSeries] = useState&lt;Record&lt;string, number&gt;&gt;({});
  const [timePeriod, setTimePeriod] = useState&lt;TimePeriod&gt;(periods.find(p =&gt; p.label === "All")!);

  // Ref to store the timeout ID
  const resetHighlightTimeout = useRef&lt;NodeJS.Timeout | null&gt;(null);

  const filteredSeries = useFilteredTimeSeries({
    allSeries: exampleSeries,
    selectedSeriesIds: selectedSeriesIds,
    period: timePeriod,
  });

  // Initialize highlightedSeries with all IDs from exampleSeries
  useEffect(() =&gt; {
    const initialHighlighted: Record&lt;string, number&gt; = {};
    filteredSeries.forEach(series =&gt; {
      initialHighlighted[series.id] = 1;
    });
    setHighlightedSeries(initialHighlighted);
  }, [filteredSeries]);

  const handleAddSeries = (series: TimeSeriesData) =&gt; {
    setSelectedSeriesIds((prev) =&gt; (
      prev.includes(series.id) ? prev : [...prev, series.id]
    ));
  };

  const handleRemoveSeries = (id: string) =&gt; {
    setSelectedSeriesIds((prev) =&gt; prev.filter(seriesId =&gt; seriesId !== id))
    setHiddenSeries((prev) =&gt; {
      const { [id]: _, ...rest } = prev
      return rest
    });
  };

  const handleTogglePlotVisibility = (id: string) =&gt; {
    setHiddenSeries(prev =&gt; ({
      ...prev, [id]: !(prev[id] ?? true)
    }));
  };

  const handleSelectPeriod = (period: TimePeriod) =&gt; {
    setTimePeriod(period);
  };

  const handleTogglePlotHighlight = (id: string) =&gt; {
    // Clear any existing timeout
    if (resetHighlightTimeout.current) {
      clearTimeout(resetHighlightTimeout.current);
    }

    setHighlightedSeries(prev =&gt; {
      const updatedOpacities: Record&lt;string, number&gt; = { ...prev };
      for (const key in updatedOpacities) {
        if (key === id) {
          updatedOpacities[key] = 1;
        } else {
          updatedOpacities[key] = 0.2;
        };
      };
      return updatedOpacities;
    });
  };

  const handleResetHighlight = () =&gt; {
    setHighlightedSeries(prev =&gt; {
      const updatedOpacities: Record&lt;string, number&gt; = { ...prev };
      for (const key in updatedOpacities) {
        updatedOpacities[key] = 1;
      };
      return updatedOpacities;
    })
  };

  const debouncedHandleResetHighlight = () =&gt; {
    // Set a timeout to reset the highlight after a delay
    // We wrap the handleResetHighlight on a timeout to debouce the effect
    // and avoid unecessary flickering when quickly moving the mouse over the
    // time series cards
    resetHighlightTimeout.current = setTimeout(() =&gt; {
      handleResetHighlight();
      resetHighlightTimeout.current = null; // Clear the timeout
    }, 100);
  };

  return (

    &lt;div className="grid grid-cols-[312px_1fr] gap-2 p-4 pt-0 h-full"&gt;

      {/* Controls */}
      &lt;div className="flex flex-col space-y-4 p-2 h-full overflow-hidden"&gt;
        &lt;CanvasHeader title={title} /&gt;
        &lt;div className="flex-1 min-h-0"&gt;
          &lt; LineControls
            header="Strategies"
            searchTriggerLabel="Add strategies"
            searchPlaceholder="Search strategies"
            series={filteredSeries}
            availableSeries={exampleSeries}
            toggledSeries={hiddenSeries}
            highlightedSeries={highlightedSeries}
            onAddSeries={handleAddSeries}
            onRemoveSeries={handleRemoveSeries}
            onTogglePlotVisibility={handleTogglePlotVisibility}
            onTogglePlotHighlight={handleTogglePlotHighlight}
            onToggleResetHighlight={debouncedHandleResetHighlight}
          /&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      {/* Figure */}
      {filteredSeries.length &gt; 0 ? (
        &lt;div className="flex flex-col space-y-4 p-2 h-full"&gt;
          &lt;div className="flex justify-end"&gt;
            &lt;TimePeriodSelector
              periods={periods}
              defaultSelected={periods.find(p =&gt; p.label === "All")}
              onPeriodSelect={handleSelectPeriod}
            /&gt;
          &lt;/div&gt;
          &lt;PlotLineFigure
            data={filteredSeries.map(series =&gt; ({
              ...series.plotData,
              opacity: highlightedSeries[series.id] ?? 1,
              line: { color: series.color },
              visible: hiddenSeries[series.id] ?? true,
            }))}
            theme="dark"
          /&gt;
        &lt;/div&gt;
      ) : (
        &lt;div className="flex items-center justify-center text-muted-foreground"&gt;
          Select Series to display the plot
        &lt;/div&gt;
      )}
    &lt;/div&gt;
  )
}

```
</llm_context>

The `PlotLine` component uses a custom hook `useFilteredTimeSeries`:

</llm_context>
<llm_context filetype="ts" name="use-filtered-timeseries.ts" path="/home/santiago/projects/testApps/components_workbench/client/src/hooks/use-filtered-timeseries.ts">
```ts
import { useMemo } from "react";
import { TimePeriod, TimeSeriesData } from "@/components/plots/models";

interface props {
  allSeries: TimeSeriesData[],
  selectedSeriesIds: string[],
  period: TimePeriod,
};

export const useFilteredTimeSeries = ({ allSeries, selectedSeriesIds, period }: props): TimeSeriesData[] =&gt; {

  return useMemo(() =&gt; {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - period.days);

    return allSeries.filter(series =&gt; selectedSeriesIds.includes(series.id)).map(series =&gt; {
      const { x: originalX, y: originalY } = series.plotData;

      const filteredData = originalX.reduce&lt;{ x: (number | string)[], y: number[] }&gt;((acc, date, index) =&gt; {
        const itemDate = new Date(date);

        if (itemDate &gt;= cutoffDate) {
          acc.x.push(date);
          acc.y.push(originalY[index]);
        }

        return acc;
      }, { x: [], y: [] });

      return {
        ...series,
        plotData: {
          ...series.plotData,
          x: filteredData.x,
          y: filteredData.y,
        },
      };
    });
  }, [allSeries, selectedSeriesIds, period]);
};
```
</llm_context>

Im going to be asking you questions and suggestions to improve this code. To start, you can see on the `TimePeriodSelector` component, we have a state variable named `selected`:

<llm_context kind="Variable" filetype="typescriptreact" name="selected">
```typescriptreact
  const [selected, setSelected] = useState&lt;TimePeriod&gt;(defaultSelected ?? periods[0])
```
</llm_context>

Which we use to track the selected period state inside the component. The thing is, we are also tracking the selected period state on the `PlotLine` component, on the `TimePeriod` state variable: 

<llm_context kind="Variable" filetype="typescriptreact" name="timePeriod">
```typescriptreact
  const [timePeriod, setTimePeriod] = useState&lt;TimePeriod&gt;(periods.find(p =&gt; p.label === "All")!);
```
</llm_context>

Do you think we are being redundant and that we could improve state management here?

---

Yes, Santiago, there's definitely redundancy in managing the `selected` time period in both the `TimePeriodSelector` and the `PlotLine` components. The `PlotLine` component should be the single source of truth for the selected time period. Here's how you can refactor the code to achieve that:

1.  **Remove the `selected` state from `TimePeriodSelector`:** The `TimePeriodSelector` should become a controlled component, meaning its state is controlled by its parent (`PlotLine` in this case).

2.  **Update `TimePeriodSelector` to use `PlotLine`'s `timePeriod` state:**  Instead of managing its own `selected` state, `TimePeriodSelector` should receive the `timePeriod` and `onPeriodSelect` as props and use them to determine which button is active and to propagate changes.

Here's the updated `TimePeriodSelector` component:

```tsx
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DateRangePicker } from "@/components/plots/ui";
import { TimePeriod } from "@/components/plots/models";

interface Props {
  periods: TimePeriod[];
  selected: TimePeriod; // Changed from defaultSelected to selected
  onPeriodSelect?: (period: TimePeriod) => void;
  onDateRangeSelect?: (range: DateRange | undefined) => void;
};

export const TimePeriodSelector = ({ periods, selected, onPeriodSelect, onDateRangeSelect }: Props) => { // Added selected prop

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
              selected.label === period.label // Use the selected prop to determine the active button
                ? "text-muted-foreground bg-primary-foreground hover:bg-muted hover:text-muted-foreground"
                : "hover:bg-muted"
            )}
            onClick={() => onPeriodSelect?.(period)} // Directly call the onPeriodSelect prop
          >
            {period.label}
          </Button>
        ))}
      </div>
      <Separator orientation="vertical" />
      <DateRangePicker
        numberOfMonths={3}
        onDateRangeChange={onDateRangeSelect}
      />
    </div>
  )
}
```

And here's how you need to change the `PlotLine` component:

```tsx
import { useState, useEffect, useRef } from "react";
import { useFilteredTimeSeries } from "@/hooks";
import { PlotLineFigure } from "./plot-line-figure";
import { LineControls } from "./plot-line-controls";
import { mockTimeSeriesData } from "@/data/mock/time-series-data";
import { TimePeriodSelector, CanvasHeader } from "@/components/plots/ui";
import { TimePeriod, periods, TimeSeriesData } from "@/components/plots/models";

interface Props {
  title: string;
};

// Example data
const exampleSeries: TimeSeriesData[] = mockTimeSeriesData.series;

export const PlotLine = ({ title }: Props) => {
  const [selectedSeriesIds, setSelectedSeriesIds] = useState<string[]>([]);
  const [hiddenSeries, setHiddenSeries] = useState<Record<string, boolean>>({});
  const [highlightedSeries, setHighlightedSeries] = useState<Record<string, number>>({});
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(periods.find(p => p.label === "All")!);

  // Ref to store the timeout ID
  const resetHighlightTimeout = useRef<NodeJS.Timeout | null>(null);

  const filteredSeries = useFilteredTimeSeries({
    allSeries: exampleSeries,
    selectedSeriesIds: selectedSeriesIds,
    period: timePeriod,
  });

  // Initialize highlightedSeries with all IDs from exampleSeries
  useEffect(() => {
    const initialHighlighted: Record<string, number> = {};
    filteredSeries.forEach(series => {
      initialHighlighted[series.id] = 1;
    });
    setHighlightedSeries(initialHighlighted);
  }, [filteredSeries]);

  const handleAddSeries = (series: TimeSeriesData) => {
    setSelectedSeriesIds((prev) => (
      prev.includes(series.id) ? prev : [...prev, series.id]
    ));
  };

  const handleRemoveSeries = (id: string) => {
    setSelectedSeriesIds((prev) => prev.filter(seriesId => seriesId !== id))
    setHiddenSeries((prev) => {
      const { [id]: _, ...rest } = prev
      return rest
    });
  };

  const handleTogglePlotVisibility = (id: string) => {
    setHiddenSeries(prev => ({
      ...prev, [id]: !(prev[id] ?? true)
    }));
  };

  const handleSelectPeriod = (period: TimePeriod) => {
    setTimePeriod(period);
  };

  const handleTogglePlotHighlight = (id: string) => {
    // Clear any existing timeout
    if (resetHighlightTimeout.current) {
      clearTimeout(resetHighlightTimeout.current);
    }

    setHighlightedSeries(prev => {
      const updatedOpacities: Record<string, number> = { ...prev };
      for (const key in updatedOpacities) {
        if (key === id) {
          updatedOpacities[key] = 1;
        } else {
          updatedOpacities[key] = 0.2;
        };
      };
      return updatedOpacities;
    });
  };

  const handleResetHighlight = () => {
    setHighlightedSeries(prev => {
      const updatedOpacities: Record<string, number> = { ...prev };
      for (const key in updatedOpacities) {
        updatedOpacities[key] = 1;
      };
      return updatedOpacities;
    })
  };

  const debouncedHandleResetHighlight = () => {
    // Set a timeout to reset the highlight after a delay
    // We wrap the handleResetHighlight on a timeout to debouce the effect
    // and avoid unecessary flickering when quickly moving the mouse over the
    // time series cards
    resetHighlightTimeout.current = setTimeout(() => {
      handleResetHighlight();
      resetHighlightTimeout.current = null; // Clear the timeout
    }, 100);
  };

  return (

    <div className="grid grid-cols-[312px_1fr] gap-2 p-4 pt-0 h-full">

      {/* Controls */}
      <div className="flex flex-col space-y-4 p-2 h-full overflow-hidden">
        <CanvasHeader title={title} />
        <div className="flex-1 min-h-0">
          < LineControls
            header="Strategies"
            searchTriggerLabel="Add strategies"
            searchPlaceholder="Search strategies"
            series={filteredSeries}
            availableSeries={exampleSeries}
            toggledSeries={hiddenSeries}
            highlightedSeries={highlightedSeries}
            onAddSeries={handleAddSeries}
            onRemoveSeries={handleRemoveSeries}
            onTogglePlotVisibility={handleTogglePlotVisibility}
            onTogglePlotHighlight={handleTogglePlotHighlight}
            onToggleResetHighlight={debouncedHandleResetHighlight}
          />
        </div>
      </div>

      {/* Figure */}
      {filteredSeries.length > 0 ? (
        <div className="flex flex-col space-y-4 p-2 h-full">
          <div className="flex justify-end">
            <TimePeriodSelector
              periods={periods}
              selected={timePeriod} // Pass the timePeriod state as the selected prop
              onPeriodSelect={handleSelectPeriod} // Pass the handleSelectPeriod function as the onPeriodSelect prop
            />
          </div>
          <PlotLineFigure
            data={filteredSeries.map(series => ({
              ...series.plotData,
              opacity: highlightedSeries[series.id] ?? 1,
              line: { color: series.color },
              visible: hiddenSeries[series.id] ?? true,
            }))}
            theme="dark"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground">
          Select Series to display the plot
        </div>
      )}
    </div>
  )
}
```

**Explanation:**

*   The `TimePeriodSelector` now receives the `selected` period and the `onPeriodSelect` handler as props.  It uses these props to determine which button is active and to notify the parent component when a new period is selected.
*   The `PlotLine` component maintains the `timePeriod` state and passes it down to the `TimePeriodSelector` as the `selected` prop.  It also passes the `handleSelectPeriod` function as the `onPeriodSelect` prop, allowing the `TimePeriodSelector` to update the `PlotLine`'s state when a new period is selected.
*   By doing this, the `TimePeriodSelector` becomes a controlled component, and the `PlotLine` component becomes the single source of truth for the selected time period.

**Benefits:**

*   **Single Source of Truth:**  The `PlotLine` component is now the single source of truth for the selected time period, making the application state more predictable and easier to manage.
*   **Improved Component Reusability:**  The `TimePeriodSelector` is now more reusable because it doesn't manage its own state.  It can be used in other components that need to select a time period.
*   **Simplified Component Logic:**  The `TimePeriodSelector` component is now simpler because it doesn't need to manage its own state.

**Next Steps:**

*   **Date Range Selection:**  You could apply a similar approach to the `DateRangePicker`. Lift the state to the parent `PlotLine` component, so the `TimePeriodSelector` becomes a fully controlled component. This will allow you to manage the selected date range in the `PlotLine` component and pass it down to the `useFilteredTimeSeries` hook, so you can filter the time series data based on the selected date range.
*   **Consider using a state management library:**  For more complex applications, consider using a state management library like Zustand or Redux to manage the application state.  This can help you to avoid prop drilling and make the application state more predictable.


Yes, i want to work on the date range selection now, im updating the context with the `DateRangePicker`

<llm_context filetype="ts" name="date-range-picker.tsx" path="/home/santiago/projects/testApps/components_workbench/client/src/components/plots/ui/date-range-picker.tsx">
  ```tsx
  import { useState } from "react";
  import { CalendarIcon } from "lucide-react";
  import { DateRange } from "react-day-picker";
  import { Button } from "@/components/ui/button";
  import { Calendar } from "@/components/ui/calendar";
  import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

  interface Props extends React.HTMLAttributes<HTMLDivElement> {
    numberOfMonths: number;
    onDateRangeChange?: (range: DateRange | undefined) => void;
  };

  export const DateRangePicker = ({ numberOfMonths = 2, onDateRangeChange }: Props) => {
    const [date, setDate] = useState<DateRange | undefined>()
    // if you want to set a range:
    // import { addDays } from "date-fns"; // date operations
    // const [date, setDate] = useState<DateRange | undefined>({from: new Date(), to: addDays(new Date(), 6)})

    const handleDateSelect = (newDate: DateRange | undefined) => {
      setDate(newDate);
      onDateRangeChange?.(newDate);
      console.log("Range selected:", date);
    };

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
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={numberOfMonths}
          />
        </PopoverContent>
      </Popover>
    )
  }
</llm_context>
```

Okay Santiago, let's refactor the `DateRangePicker` to lift the state to the parent `PlotLine` component, making it a controlled component, similar to what we did with the `TimePeriodSelector`.

**Changes:**

1.  **Modify `DateRangePicker` Props:** Remove the internal `useState` for `date` and instead receive `date` and `onDateChange` as props.

2.  **Update `TimePeriodSelector` Props:** Add props `dateRange` and `onDateRangeChange`. Remove `onDateRangeSelect`

3.  **Update `PlotLine` Component:**
    *   Add state for the `dateRange`.
    *   Pass the `dateRange` state and its setter to the `TimePeriodSelector`.
    *   Update the `useFilteredTimeSeries` hook to accept the `dateRange`.
    *   Modify the `useFilteredTimeSeries` hook to filter data based on `dateRange`.

Here's the updated `DateRangePicker` component:

```tsx
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  numberOfMonths: number;
  date: DateRange | undefined; // Receive date as a prop
  onDateChange?: (range: DateRange | undefined) => void; // Receive onDateChange as a prop
};

export const DateRangePicker = ({ numberOfMonths = 2, date, onDateChange }: Props) => { // Destructure date and onDateChange from props

  const handleDateSelect = (newDate: DateRange | undefined) => {
    onDateChange?.(newDate); // Call the onDateChange prop
    console.log("Range selected:", newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-8 w-10 rounded-lg">
          <CalendarIcon className="h-4 w-4" />
        </PopoverTrigger>
      </Popover>
      <PopoverContent className="w-auto p-2" align="end">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={handleDateSelect}
          numberOfMonths={numberOfMonths}
        />
      </PopoverContent>
    </Popover>
  )
}
```

Here's the updated `TimePeriodSelector` component:

```tsx
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DateRangePicker } from "@/components/plots/ui";
import { TimePeriod } from "@/components/plots/models";

interface Props {
  periods: TimePeriod[];
  selected: TimePeriod;
  dateRange: DateRange | undefined; // Add dateRange prop
  onPeriodSelect?: (period: TimePeriod) => void;
  onDateRangeChange?: (range: DateRange | undefined) => void; // Add onDateRangeChange prop
};

export const TimePeriodSelector = ({ periods, selected, dateRange, onPeriodSelect, onDateRangeChange }: Props) => { // Added dateRange and onDateRangeChange props

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
              selected.label === period.label
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
        date={dateRange} // Pass the dateRange prop
        onDateChange={onDateRangeChange} // Pass the onDateRangeChange prop
      />
    </div>
  )
}
```

Here's how you need to change the `PlotLine` component:

```tsx
import { useState, useEffect, useRef } from "react";
import { useFilteredTimeSeries } from "@/hooks";
import { PlotLineFigure } from "./plot-line-figure";
import { LineControls } from "./plot-line-controls";
import { mockTimeSeriesData } from "@/data/mock/time-series-data";
import { TimePeriodSelector, CanvasHeader } from "@/components/plots/ui";
import { TimePeriod, periods, TimeSeriesData } from "@/components/plots/models";
import { DateRange } from "react-day-picker";

interface Props {
  title: string;
};

// Example data
const exampleSeries: TimeSeriesData[] = mockTimeSeriesData.series;

export const PlotLine = ({ title }: Props) => {
  const [selectedSeriesIds, setSelectedSeriesIds] = useState<string[]>([]);
  const [hiddenSeries, setHiddenSeries] = useState<Record<string, boolean>>({});
  const [highlightedSeries, setHighlightedSeries] = useState<Record<string, number>>({});
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(periods.find(p => p.label === "All")!);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined); // Add dateRange state

  // Ref to store the timeout ID
  const resetHighlightTimeout = useRef<NodeJS.Timeout | null>(null);

  const filteredSeries = useFilteredTimeSeries({
    allSeries: exampleSeries,
    selectedSeriesIds: selectedSeriesIds,
    period: timePeriod,
    dateRange: dateRange, // Pass dateRange to useFilteredTimeSeries
  });

  // Initialize highlightedSeries with all IDs from exampleSeries
  useEffect(() => {
    const initialHighlighted: Record<string, number> = {};
    filteredSeries.forEach(series => {
      initialHighlighted[series.id] = 1;
    });
    setHighlightedSeries(initialHighlighted);
  }, [filteredSeries]);

  const handleAddSeries = (series: TimeSeriesData) => {
    setSelectedSeriesIds((prev) => (
      prev.includes(series.id) ? prev : [...prev, series.id]
    ));
  };

  const handleRemoveSeries = (id: string) => {
    setSelectedSeriesIds((prev) => prev.filter(seriesId => seriesId !== id))
    setHiddenSeries((prev) => {
      const { [id]: _, ...rest } = prev
      return rest
    });
  };

  const handleTogglePlotVisibility = (id: string) => {
    setHiddenSeries(prev => ({
      ...prev, [id]: !(prev[id] ?? true)
    }));
  };

  const handleSelectPeriod = (period: TimePeriod) => {
    setTimePeriod(period);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleTogglePlotHighlight = (id: string) => {
    // Clear any existing timeout
    if (resetHighlightTimeout.current) {
      clearTimeout(resetHighlightTimeout.current);
    }

    setHighlightedSeries(prev => {
      const updatedOpacities: Record<string, number> = { ...prev };
      for (const key in updatedOpacities) {
        if (key === id) {
          updatedOpacities[key] = 1;
        } else {
          updatedOpacities[key] = 0.2;
        };
      };
      return updatedOpacities;
    });
  };

  const handleResetHighlight = () => {
    setHighlightedSeries(prev => {
      const updatedOpacities: Record<string, number> = { ...prev };
      for (const key in updatedOpacities) {
        updatedOpacities[key] = 1;
      };
      return updatedOpacities;
    })
  };

  const debouncedHandleResetHighlight = () => {
    // Set a timeout to reset the highlight after a delay
    // We wrap the handleResetHighlight on a timeout to debouce the effect
    // and avoid unecessary flickering when quickly moving the mouse over the
    // time series cards
    resetHighlightTimeout.current = setTimeout(() => {
      handleResetHighlight();
      resetHighlightTimeout.current = null; // Clear the timeout
    }, 100);
  };

  return (

    <div className="grid grid-cols-[312px_1fr] gap-2 p-4 pt-0 h-full">

      {/* Controls */}
      <div className="flex flex-col space-y-4 p-2 h-full overflow-hidden">
        <CanvasHeader title={title} />
        <div className="flex-1 min-h-0">
          < LineControls
            header="Strategies"
            searchTriggerLabel="Add strategies"
            searchPlaceholder="Search strategies"
            series={filteredSeries}
            availableSeries={exampleSeries}
            toggledSeries={hiddenSeries}
            highlightedSeries={highlightedSeries}
            onAddSeries={handleAddSeries}
            onRemoveSeries={handleRemoveSeries}
            onTogglePlotVisibility={handleTogglePlotVisibility}
            onTogglePlotHighlight={handleTogglePlotHighlight}
            onToggleResetHighlight={debouncedHandleResetHighlight}
          />
        </div>
      </div>

      {/* Figure */}
      {filteredSeries.length > 0 ? (
        <div className="flex flex-col space-y-4 p-2 h-full">
          <div className="flex justify-end">
            <TimePeriodSelector
              periods={periods}
              selected={timePeriod}
              dateRange={dateRange} // Pass dateRange to TimePeriodSelector
              onPeriodSelect={handleSelectPeriod}
              onDateRangeChange={handleDateRangeChange} // Pass handleDateRangeChange to TimePeriodSelector
            />
          </div>
          <PlotLineFigure
            data={filteredSeries.map(series => ({
              ...series.plotData,
              opacity: highlightedSeries[series.id] ?? 1,
              line: { color: series.color },
              visible: hiddenSeries[series.id] ?? true,
            }))}
            theme="dark"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground">
          Select Series to display the plot
        </div>
      )}
    </div>
  )
}
```

Finally, update the `useFilteredTimeSeries` hook to filter based on the date range:

```ts
import { useMemo } from "react";
import { TimePeriod, TimeSeriesData } from "@/components/plots/models";
import { DateRange } from "react-day-picker";

interface props {
  allSeries: TimeSeriesData[],
  selectedSeriesIds: string[],
  period: TimePeriod,
  dateRange: DateRange | undefined, // Add dateRange to props
};

export const useFilteredTimeSeries = ({ allSeries, selectedSeriesIds, period, dateRange }: props): TimeSeriesData[] => {

  return useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - period.days);

    return allSeries.filter(series => selectedSeriesIds.includes(series.id)).map(series => {
      const { x: originalX, y: originalY } = series.plotData;

      const filteredData = originalX.reduce<{ x: (number | string)[], y: number[] }>((acc, date, index) => {
        const itemDate = new Date(date);

        // Apply both time period and date range filters
        if (
          itemDate >= cutoffDate &&
          (!dateRange?.from || itemDate >= dateRange.from) &&
          (!dateRange?.to || itemDate <= dateRange.to)
        ) {
          acc.x.push(date);
          acc.y.push(originalY[index]);
        }

        return acc;
      }, { x: [], y: [] });

      return {
        ...series,
        plotData: {
          ...series.plotData,
          x: filteredData.x,
          y: filteredData.y,
        },
      };
    });
  }, [allSeries, selectedSeriesIds, period, dateRange]); // Add dateRange to the dependency array
};
```

**Explanation:**

*   **`DateRangePicker` as Controlled Component:** The `DateRangePicker` now receives the `date` and `onDateChange` props, making it a controlled component.
*   **State Management in `PlotLine`:** The `PlotLine` component now manages the `dateRange` state and passes it down to the `TimePeriodSelector`.
*   **Filtering in `useFilteredTimeSeries`:** The `useFilteredTimeSeries` hook now accepts the `dateRange` and filters the data based on both the `period` and the `dateRange`.

**Benefits:**

*   **Centralized State Management:** The `PlotLine` component now manages both the `timePeriod` and `dateRange` states, providing a single source of truth for the selected time period and date range.
*   **More Flexible Filtering:** The `useFilteredTimeSeries` hook now filters the data based on both the `timePeriod` and the `dateRange`, allowing for more flexible filtering options.

**Further Improvements:**

*   **Debouncing the `handleDateRangeChange`:**  Consider debouncing the `handleDateRangeChange` function in `PlotLine` to avoid excessive re-renders when the user is actively selecting a date range.
*   **Custom Date Range Logic:** You could add more complex logic for handling date ranges, such as allowing the user to select a custom date range or to specify a relative date range (e.g., "last 7 days", "last 30 days").
*   **Error Handling:** Add error handling to the `useFilteredTimeSeries` hook to handle cases where the date range is invalid or the data is not in the expected format.


Explain to me the logic behind this bit on the `useFilteredTimeSeries` hook:

        if (
          itemDate >= cutoffDate &&
          (!dateRange?.from || itemDate >= dateRange.from) &&
          (!dateRange?.to || itemDate <= dateRange.to)
        ) {
          acc.x.push(date);
          acc.y.push(originalY[index]);
        }

Okay, Santiago, let's break down the logic behind that `if` statement in the `useFilteredTimeSeries` hook:

```ts
if (
  itemDate >= cutoffDate &&
  (!dateRange?.from || itemDate >= dateRange.from) &&
  (!dateRange?.to || itemDate <= dateRange.to)
) {
  acc.x.push(date);
  acc.y.push(originalY[index]);
}
```

This `if` statement determines whether a specific data point (`itemDate` and its corresponding `originalY` value) should be included in the filtered time series data. It checks three conditions, all of which must be true for the data point to be included:

1.  **`itemDate >= cutoffDate`**:

    *   This condition checks if a valid date, `itemDate >= dateRange.from` checks if the `itemDate` is greater than or equal to the start date of the date range. If it is, the condition evaluates to `true` (we include the data point). date range. If it is, the condition evaluates to `true` (we include the data point).
    *   In summary, this condition ensures that if an end date is selected in the date range, only data points with dates less than or equal to the end date are included. If no end date is selected, all data points pass this condition.

**In essence, the `if` statement implements the followi or the date is after the start date **AND**
*   either no end date is selected in the date range, or the date is before the end date"

This ensures that the filtered data includes only the data points that fall within both the selected time period and the selected date range. If either the time period orng logic:** the date range is not selected (i.e., the user wants to see all data), the filtering is adjusted accordingly to include all relevant data points.


"Include the data point in the filtered data if its date is:

*   within the selected time period **AND**
*   either no start date is selected in the date range,
    *   In summary, this condition ensures that if the date of the current data po a start date is selected in the date range, only data points with dates great selected in the date range, so the condition evaluates to `true` (we include the data point).
    *   If `dateRange?.to` has a valid date, `itemDate <= dateRange.to` checks if the `itemDate` is less than or equal to the end date of theer than or equal to the start date are included. If no start date is selected, all data points pass this condition.

3.  **`(!dateRange?.to || itemDate <= dateRange.to)`**:
 might be `undefined` or `null`.
    *   `!dateRange?.to` checks if `dateRange?.to` is falsy (i.e., `undefined`, `null`, or an empty value). If `dateRange?.to` is falsy, it means no end date is
    *   int (`itemDate`) is within the selected time period.`).This condition checks if the date of the current data point (`itemDate`) is within the selected date range's end date (`dateRange.to`).
    *   `dateRange?.to` safely accesses the `to` property of the `dateRange` object, handling the case where `dateRange`
    *   `dateRange?.from` safely accesses the `from` property of the `dateRange` object, handling the case where `dateRange` might be `undefined` or `null`.
    *   `!dateRange?.from` checks if `dateRange?.from` is falsy (i.e., `undefined`, `null`, or an empty value). If `dateRange?.from` is falsy, it means no start date is selected in the date range, so the condition evaluates to `true` (we include the data point).
    *   If `dateRange?.from` has
    *   `cutoffDate` is calculated based on the selected `period` (e.g., "1 Week", "1 Month", "All"). It represents the date before which data points should be excluded based on the time period selection.
    *   So, this condition ensures that only data points with dates greater than or equal to the `cutoffDate` are included.

2.  **`(!dateRange?.from || itemDate >= dateRange.from)`**:

    *   This condition checks if the date of the current data point (`itemDate`) is within the selected date range's start date (`dateRange.from

What if i wanted to have both filtering components be independent? If i filter based on period, the filtering triggers, if i filter based on dateRange, the filtering happens again using the `allSeries`.

Okay, Santiago, if you want the time period and date range filters to operate independently, applying one after the other to the original `allSeries`, you need to modify the `useFilteredTimeSeries` hook.  Instead of applying both filters in a single pass, you'll apply them sequentially.

Here's how you can modify the `useFilteredTimeSeries` hook:

```ts
import { useMemo } from "react";
import { TimePeriod, TimeSeriesData } from "@/components/plots/models";
import { DateRange } from "react-day-picker";

interface Props {
  allSeries: TimeSeriesData[];
  selectedSeriesIds: string[];
  period: TimePeriod;
  dateRange: DateRange | undefined;
};

export const useFilteredTimeSeries = ({ allSeries, selectedSeriesIds, period, dateRange }: Props): TimeSeriesData[] => {

  return useMemo(() => {
    // 1. Filter by selected series IDs
    const seriesFilteredById = allSeries.filter(series => selectedSeriesIds.includes(series.id));

    // 2. Filter by time period
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - period.days);

    const seriesFilteredByPeriod = seriesFilteredById.map(series => {
      const { x: originalX, y: originalY } = series.plotData;

      const filteredData = originalX.reduce<{ x: (number | string)[], y: number[] }>((acc, date, index) => {
        const itemDate = new Date(date);

        if (itemDate >= cutoffDate) {
          acc.x.push(date);
          acc.y.push(originalY[index]);
        }

        return acc;
      }, { x: [], y: [] });

      return {
        ...series,
        plotData: {
          ...series.plotData,
          x: filteredData.x,
          y: filteredData.y,
        },
      };
    });

    // 3. Filter by date range
    const seriesFilteredByDateRange = seriesFilteredByPeriod.map(series => {
      const { x: originalX, y: originalY } = series.plotData;

      const filteredData = originalX.reduce<{ x: (number | string)[], y: number[] }>((acc, date, index) => {
        const itemDate = new Date(date);

        if (
          (!dateRange?.from || itemDate >= dateRange.from) &&
          (!dateRange?.to || itemDate <= dateRange.to)
        ) {
          acc.x.push(date);
          acc.y.push(originalY[index]);
        }

        return acc;
      }, { x: [], y: [] });

      return {
        ...series,
        plotData: {
          ...series.plotData,
          x: filteredData.x,
          y: filteredData.y,
        },
      };
    });

    return seriesFilteredByDateRange;
  }, [allSeries, selectedSeriesIds, period, dateRange]);
};
```

**Explanation:**

1.  **Filter by Series IDs:** The code first filters the `allSeries` based on the `selectedSeriesIds`. This ensures that only the series selected by the user are included in the subsequent filtering steps.

2.  **Filter by Time Period:** The code then filters the series obtained from the previous step (`seriesFilteredById`) based on the selected time period. This filtering step is similar to the original implementat selected date range.

**Benefits:** order in which the filters are applied.


   **Performance Optimization:** If you have a very large dataset, you might want to consider optimizing the performance of the filtering process. You could use techniques such as memoization or indexing to speed up the filtering operations.
*   **Flexibility:** You could make the filtering logic more flexible by allowing the user to specify the
*   **Independent Filtering:** The time period and date range filters now operate independently, allowing the user to apply one filter after the other.
*   **Clearer Logic:** The filtering logic is now more modular and easier to understand.

**Potential Improvements:**

*ion, where data points outside the selected time period are excluded.

3.  **Filter by Date Range:** Finally, the code filters the series obtained from the previous step (`seriesFilteredByPeriod`) based on the selected date range. This filtering step excludes data points outside the



This is not the approach i want. You misunderstood me. I want both filtering mechanisms to be independent. Would that be possible? that means the filtering should be in a way "stateless" between both filtering components.

I understand now, Santiago. You want the `TimePeriodSelector` and `DateRangePicker` to act as completely independent filters, each triggering a filtering operation on the full `allSeries` dataset *without* considering the other's state. This implies that changing the time period shouldn't affect the date range filter, and vice versa.

To achieve this "stateless" filtering, you'll need to apply the filtering logic directly within the `PlotLine` component whenever either the `timePeriod` or `dateRange` changes.  You'll have two separate `useMemo` hooks, one for each filter, and then combine the results.

Here's how you can modify the `PlotLine` component and introduce a new hook to achieve independent filtering:

First, let's create a new hook called `useIndependentFilteredTimeSeries`:

```ts
import { useMemo } from "react";
import { TimePeriod, TimeSeriesData } from "@/components/plots/models";
import { DateRange } from "react-day-picker";

interface Props {
  allSeries: TimeSeriesData[];
  selectedSeriesIds: string[];
  period?: TimePeriod;
  dateRange?: DateRange;
};

export const useIndependentFilteredTimeSeries = ({ allSeries, selectedSeriesIds, period, dateRange }: Props): TimeSeriesData[] => {

  return useMemo(() => {
    // 1. Filter by selected series IDs
    let seriesFilteredById = allSeries.filter(series => selectedSeriesIds.includes(series.id));

    // 2. Filter by time period
    if (period) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - period.days);

      seriesFilteredById = seriesFilteredById.map(series => {
        const { x: originalX, y: originalY } = series.plotData;

        const filteredData = originalX.reduce<{ x: (number | string)[], y: number[] }>((acc, date, index) => {
          const itemDate = new Date(date);

          if (itemDate >= cutoffDate) {
            acc.x.push(date);
            acc.y.push(originalY[index]);
          }

          return acc;
        }, { x: [], y: [] });

        return {
          ...series,
          plotData: {
            ...series.plotData,
            x: filteredData.x,
            y: filteredData.y,
          },
        };
      });
    }

    // 3. Filter by date range
    if (dateRange) {
      seriesFilteredById = seriesFilteredById.map(series => {
        const { x: originalX, y: originalY } = series.plotData;

        const filteredData = originalX.reduce<{ x: (number | string)[], y: number[] }>((acc, date, index) => {
          const itemDate = new Date(date);

          if (
            (!dateRange?.from || itemDate >= dateRange.from) &&
            (!dateRange?.to || itemDate <= dateRange.to)
          ) {
            acc.x.push(date);
            acc.y.push(originalY[index]);
          }

          return acc;
        }, { x: [], y: [] });

        return {
          ...series,
          plotData: {
            ...series.plotData,
            x: filteredData.x,
            y: filteredData.y,
          },
        };
      });
    }

    return seriesFilteredById;
  }, [allSeries, selectedSeriesIds, period, dateRange]);
};
```

Now, you can simply the `PlotLine` component to use this hook:

```tsx
import { useState, useEffect, useRef } from "react";
import { useIndependentFilteredTimeSeries } from "@/hooks";
import { PlotLineFigure } from "./plot-line-figure";
import { LineControls } from "./plot-line-controls";
import { mockTimeSeriesData } from "@/data/mock/time-series-data";
import { TimePeriodSelector, CanvasHeader } from "@/components/plots/ui";
import { TimePeriod, periods, TimeSeriesData } from "@/components/plots/models";
import { DateRange } from "react-day-picker";

interface Props {
  title: string;
};

// Example data
const exampleSeries: TimeSeriesData[] = mockTimeSeriesData.series;

export const PlotLine = ({ title }: Props) => {
  const [selectedSeriesIds, setSelectedSeriesIds] = useState<string[]>([]);
  const [hiddenSeries, setHiddenSeries] = useState<Record<string, boolean>>({});
  const [highlightedSeries, setHighlightedSeries] = useState<Record<string, number>>({});
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(periods.find(p => p.label === "All")!);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined); // Add dateRange state

  // Ref to store the timeout ID
  const resetHighlightTimeout = useRef<NodeJS.Timeout | null>(null);

  const filteredSeries = useIndependentFilteredTimeSeries({
    allSeries: exampleSeries,
    selectedSeriesIds: selectedSeriesIds,
    period: timePeriod,
    dateRange: dateRange,
  });

  // Initialize highlightedSeries with all IDs from exampleSeries
  useEffect(() => {
    const initialHighlighted: Record<string, number> = {};
    filteredSeries.forEach(series => {
      initialHighlighted[series.id] = 1;
    });
    setHighlightedSeries(initialHighlighted);
  }, [filteredSeries]);

  const handleAddSeries = (series: TimeSeriesData) => {
    setSelectedSeriesIds((prev) => (
      prev.includes(series.id) ? prev : [...prev, series.id]
    ));
  };

  const handleRemoveSeries = (id: string) => {
    setSelectedSeriesIds((prev) => prev.filter(seriesId => seriesId !== id))
    setHiddenSeries((prev) => {
      const { [id]: _, ...rest } = prev
      return rest
    });
  };

  const handleTogglePlotVisibility = (id: string) => {
    setHiddenSeries(prev => ({
      ...prev, [id]: !(prev[id] ?? true)
    }));
  };

  const handleSelectPeriod = (period: TimePeriod) => {
    setTimePeriod(period);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleTogglePlotHighlight = (id: string) => {
    // Clear any existing timeout
    if (resetHighlightTimeout.current) {
      clearTimeout(resetHighlightTimeout.current);
    }

    setHighlightedSeries(prev => {
      const updatedOpacities: Record<string, number> = { ...prev };
      for (const key in updatedOpacities) {
        if (key === id) {
          updatedOpacities[key] = 1;
        } else {
          updatedOpacities[key] = 0.2;
        };
      };
      return updatedOpacities;
    });
  };

  const handleResetHighlight = () => {
    setHighlightedSeries(prev => {
      const updatedOpacities: Record<string, number> = { ...prev };
      for (const key in updatedOpacities) {
        updatedOpacities[key] = 1;
      };
      return updatedOpacities;
    })
  };

  const debouncedHandleResetHighlight = () => {
    // Set a timeout to reset the highlight after a delay
    // We wrap the handleResetHighlight on a timeout to debouce the effect
    // and avoid unecessary flickering when quickly moving the mouse over the
    // time series cards
    resetHighlightTimeout.current = setTimeout(() => {
      handleResetHighlight();
      resetHighlightTimeout.current = null; // Clear the timeout
    }, 100);
  };

  return (

    <div className="grid grid-cols-[312px_1fr] gap-2 p-4 pt-0 h-full">

      {/* Controls */}
      <div className="flex flex-col space-y-4 p-2 h-full overflow-hidden">
        <CanvasHeader title={title} />
        <div className="flex-1 min-h-0">
          < LineControls
            header="Strategies"
            searchTriggerLabel="Add strategies"
            searchPlaceholder="Search strategies"
            series={filteredSeries}
            availableSeries={exampleSeries}
            toggledSeries={hiddenSeries}
            highlightedSeries={highlightedSeries}
            onAddSeries={handleAddSeries}
            onRemoveSeries={handleRemoveSeries}
            onTogglePlotVisibility={handleTogglePlotVisibility}
            onTogglePlotHighlight={handleTogglePlotHighlight}
            onToggleResetHighlight={debouncedHandleResetHighlight}
          />
        </div>
      </div>

      {/* Figure */}
      {filteredSeries.length > 0 ? (
        <div className="flex flex-col space-y-4 p-2 h-full">
          <div className="flex justify-end">
            <TimePeriodSelector
              periods={periods}
              selected={timePeriod}
              dateRange={dateRange} // Pass dateRange to TimePeriodSelector
              onPeriodSelect={handleSelectPeriod}
              onDateRangeChange={handleDateRangeChange} // Pass handleDateRangeChange to TimePeriodSelector
            />
          </div>
          <PlotLineFigure
            data={filteredSeries.map(series => ({
              ...series.plotData,
              opacity: highlightedSeries[series.id] ?? 1,
              line: { color: series.color },
              visible: hiddenSeries[series.id] ?? true,
            }))}
            theme="dark"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground">
          Select Series to display the plot
        </div>
      )}
    </div>
  )
}
```

**Explanation:**

*   **Filtering in `useIndependentFilteredTimeSeries`:** The `useIndependentFilteredTimeSeries` hook applies the time period and date range filters independently to the `allSeries` data. This ensures that each filter operates on the complete dataset without considering the other's state.

With these changes, the `TimePeriodSelector` and `DateRangePicker` will function as independent filters, each triggering a filtering operation on the full `allSeries` dataset.

**Potential Improvements:**

*   **Consider adding a reset button:**  You could add a button to reset both filters to their default states (e.g., "All" for time period and no date range selected).
*   **Explore alternative UI patterns:**  For more complex filtering scenarios, you might want to explore alternative UI patterns such as a dedicated filter panel or a set of toggleable filter options.


This approach isnt working, how about we make sure we "reset" the state of the other component if one is changed? say, if we select a period, we reset the dateRange to undefined, and if we select a dateRange we reset the period to the default version "All"

Okay, Santiago, I understand. You want to ensure that when the user interacts with one filter (either `TimePeriodSelector` or `DateRangePicker`), the other filter is reset to its default state. This will create a mutually exclusive filtering behavior.

Here's how you can modify the `PlotLine` component to achieve this:

```tsx
import { useState, useEffect, useRef } from "react";
import { useFilteredTimeSeries } from "@/hooks";
import { PlotLineFigure } from "./plot-line-figure";
import { LineControls } from "./plot-line-controls";
import { mockTimeSeriesData } from "@/data/mock/time-series-data";
import { TimePeriodSelector, CanvasHeader } from "@/components/plots/ui";
import { TimePeriod, periods, TimeSeriesData } from "@/components/plots/models";
import { DateRange } from "react-day-picker";

interface Props {
  title: string;
};

// Example data
const exampleSeries: TimeSeriesData[] = mockTimeSeriesData.series;

export const PlotLine = ({ title }: Props) => {
  const [selectedSeriesIds, setSelectedSeriesIds] = useState<string[]>([]);
  const [hiddenSeries, setHiddenSeries] = useState<Record<string, boolean>>({});
  const [highlightedSeries, setHighlightedSeries] = useState<Record<string, number>>({});
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(periods.find(p => p.label === "All")!);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined); // Add dateRange state

  // Ref to store the timeout ID
  const resetHighlightTimeout = useRef<NodeJS.Timeout | null>(null);

  const filteredSeries = useFilteredTimeSeries({
    allSeries: exampleSeries,
    selectedSeriesIds: selectedSeriesIds,
    period: timePeriod,
    dateRange: dateRange,
  });

  // Initialize highlightedSeries with all IDs from exampleSeries
  useEffect(() => {
    const initialHighlighted: Record<string, number> = {};
    filteredSeries.forEach(series => {
      initialHighlighted[series.id] = 1;
    });
    setHighlightedSeries(initialHighlighted);
  }, [filteredSeries]);

  const handleAddSeries = (series: TimeSeriesData) => {
    setSelectedSeriesIds((prev) => (
      prev.includes(series.id) ? prev : [...prev, series.id]
    ));
  };

  const handleRemoveSeries = (id: string) => {
    setSelectedSeriesIds((prev) => prev.filter(seriesId => seriesId !== id))
    setHiddenSeries((prev) => {
      const { [id]: _, ...rest } = prev
      return rest
    });
  };

  const handleTogglePlotVisibility = (id: string) => {
    setHiddenSeries(prev => ({
      ...prev, [id]: !(prev[id] ?? true)
    }));
  };

  const handleSelectPeriod = (period: TimePeriod) => {
    setTimePeriod(period);
    setDateRange(undefined); // Reset dateRange when a period is selected
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setTimePeriod(periods.find(p => p.label === "All")!); // Reset period to "All" when a date range is selected
  };

  const handleTogglePlotHighlight = (id: string) => {
    // Clear any existing timeout
    if (resetHighlightTimeout.current) {
      clearTimeout(resetHighlightTimeout.current);
    }

    setHighlightedSeries(prev => {
      const updatedOpacities: Record<string, number> = { ...prev };
      for (const key in updatedOpacities) {
        if (key === id) {
          updatedOpacities[key] = 1;
        } else {
          updatedOpacities[key] = 0.2;
        };
      };
      return updatedOpacities;
    });
  };

  const handleResetHighlight = () => {
    setHighlightedSeries(prev => {
      const updatedOpacities: Record<string, number> = { ...prev };
      for (const key in updatedOpacities) {
        updatedOpacities[key] = 1;
      };
      return updatedOpacities;
    })
  };

  const debouncedHandleResetHighlight = () => {
    // Set a timeout to reset the highlight after a delay
    // We wrap the handleResetHighlight on a timeout to debouce the effect
    // and avoid unecessary flickering when quickly moving the mouse over the
    // time series cards
    resetHighlightTimeout.current = setTimeout(() => {
      handleResetHighlight();
      resetHighlightTimeout.current = null; // Clear the timeout
    }, 100);
  };

  return (

    <div className="grid grid-cols-[312px_1fr] gap-2 p-4 pt-0 h-full">

      {/* Controls */}
      <div className="flex flex-col space-y-4 p-2 h-full overflow-hidden">
        <CanvasHeader title={title} />
        <div className="flex-1 min-h-0">
          < LineControls
            header="Strategies"
            searchTriggerLabel="Add strategies"
            searchPlaceholder="Search strategies"
            series={filteredSeries}
            availableSeries={exampleSeries}
            toggledSeries={hiddenSeries}
            highlightedSeries={highlightedSeries}
            onAddSeries={handleAddSeries}
            onRemoveSeries={handleRemoveSeries}
            onTogglePlotVisibility={handleTogglePlotVisibility}
            onTogglePlotHighlight={handleTogglePlotHighlight}
            onToggleResetHighlight={debouncedHandleResetHighlight}
          />
        </div>
      </div>

      {/* Figure */}
      {filteredSeries.length > 0 ? (
        <div className="flex flex-col space-y-4 p-2 h-full">
          <div className="flex justify-end">
            <TimePeriodSelector
              periods={periods}
              selected={timePeriod}
              dateRange={dateRange} // Pass dateRange to TimePeriodSelector
              onPeriodSelect={handleSelectPeriod}
              onDateRangeChange={handleDateRangeChange} // Pass handleDateRangeChange to TimePeriodSelector
            />
          </div>
          <PlotLineFigure
            data={filteredSeries.map(series => ({
              ...series.plotData,
              opacity: highlightedSeries[series.id] ?? 1,
              line: { color: series.color },
              visible: hiddenSeries[series.id] ?? true,
            }))}
            theme="dark"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground">
          Select Series to display the plot
        </div>
      )}
    </div>
  )
}
```

**Key Changes:**

*   **`handleSelectPeriod`:** When a time period is selected, the `dateRange` state is set to `undefined`, effectively clearing the date range filter.
*   **`handleDateRangeChange`:** When a date range is selected, the `timePeriod` state is set to the "All" period, effectively clearing the time period filter.

With these changes, the `TimePeriodSelector` and `DateRangePicker` will act as mutually exclusive filters. When the user selects a time period, the date range filter will be cleared, and vice versa.

**Potential Improvements:**

*   **Visual indication of reset:**  You could provide a visual indication to the user that the other filter has been reset. For example, you could briefly highlight the reset filter or display a message indicating that it has been cleared.
*   **Customizable default period:**  Instead of hardcoding the default period as "All", you could make it customizable via a prop.

Ok lets define the default period via prop

Okay, Santiago, let's modify the `PlotLine` component to accept a `defaultPeriod` prop, allowing you to customize the default time period.

Here's the updated `PlotLine` component:

```tsx
import { useState, useEffect, useRef } from "react";
import { useFilteredTimeSeries } from "@/hooks";
import { PlotLineFigure } from "./plot-line-figure";
import { LineControls } from "./plot-line-controls";
import { mockTimeSeriesData } from "@/data/mock/time-series-data";
import { TimePeriodSelector, CanvasHeader } from "@/components/plots/ui";
import { TimePeriod, periods, TimeSeriesData } from "@/components/plots/models";
import { DateRange } from "react-day-picker";

interface Props {
  title: string;
  defaultPeriod?: string; // New prop to define the default period
};

// Example data
const exampleSeries: TimeSeriesData[] = mockTimeSeriesData.series;

export const PlotLine = ({ title, defaultPeriod = "All" }: Props) => { // Added default value to defaultPeriod
  const [selectedSeriesIds, setSelectedSeriesIds] = useState<string[]>([]);
  const [hiddenSeries, setHiddenSeries] = useState<Record<string, boolean>>({});
  const [highlightedSeries, setHighlightedSeries] = useState<Record<string, number>>({});
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(periods.find(p => p.label === defaultPeriod)!); // Use defaultPeriod to set initial state
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined); // Add dateRange state

  // Ref to store the timeout ID
  const resetHighlightTimeout = useRef<NodeJS.Timeout | null>(null);

  const filteredSeries = useFilteredTimeSeries({
    allSeries: exampleSeries,
    selectedSeriesIds: selectedSeriesIds,
    period: timePeriod,
    dateRange: dateRange,
  });

  // Initialize highlightedSeries with all IDs from exampleSeries
  useEffect(() => {
    const initialHighlighted: Record<string, number> = {};
    filteredSeries.forEach(series => {
      initialHighlighted[series.id] = 1;
    });
    setHighlightedSeries(initialHighlighted);
  }, [filteredSeries]);

  const handleAddSeries = (series: TimeSeriesData) => {
    setSelectedSeriesIds((prev) => (
      prev.includes(series.id) ? prev : [...prev, series.id]
    ));
  };

  const handleRemoveSeries = (id: string) => {
    setSelectedSeriesIds((prev) => prev.filter(seriesId => seriesId !== id))
    setHiddenSeries((prev) => {
      const { [id]: _, ...rest } = prev
      return rest
    });
  };

  const handleTogglePlotVisibility = (id: string) => {
    setHiddenSeries(prev => ({
      ...prev, [id]: !(prev[id] ?? true)
    }));
  };

  const handleSelectPeriod = (period: TimePeriod) => {
    setTimePeriod(period);
    setDateRange(undefined); // Reset dateRange when a period is selected
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setTimePeriod(periods.find(p => p.label === defaultPeriod)!); // Reset period to defaultPeriod when a date range is selected
  };

  const handleTogglePlotHighlight = (id: string) => {
    // Clear any existing timeout
    if (resetHighlightTimeout.current) {
      clearTimeout(resetHighlightTimeout.current);
    }

    setHighlightedSeries(prev => {
      const updatedOpacities: Record<string, number> = { ...prev };
      for (const key in updatedOpacities) {
        if (key === id) {
          updatedOpacities[key] = 1;
        } else {
          updatedOpacities[key] = 0.2;
        };
      };
      return updatedOpacities;
    });
  };

  const handleResetHighlight = () => {
    setHighlightedSeries(prev => {
      const updatedOpacities: Record<string, number> = { ...prev };
      for (const key in updatedOpacities) {
        updatedOpacities[key] = 1;
      };
      return updatedOpacities;
    })
  };

  const debouncedHandleResetHighlight = () => {
    // Set a timeout to reset the highlight after a delay
    // We wrap the handleResetHighlight on a timeout to debouce the effect
    // and avoid unecessary flickering when quickly moving the mouse over the
    // time series cards
    resetHighlightTimeout.current = setTimeout(() => {
      handleResetHighlight();
      resetHighlightTimeout.current = null; // Clear the timeout
    }, 100);
  };

  return (

    <div className="grid grid-cols-[312px_1fr] gap-2 p-4 pt-0 h-full">

      {/* Controls */}
      <div className="flex flex-col space-y-4 p-2 h-full overflow-hidden">
        <CanvasHeader title={title} />
        <div className="flex-1 min-h-0">
          < LineControls
            header="Strategies"
            searchTriggerLabel="Add strategies"
            searchPlaceholder="Search strategies"
            series={filteredSeries}
            availableSeries={exampleSeries}
            toggledSeries={hiddenSeries}
            highlightedSeries={highlightedSeries}
            onAddSeries={handleAddSeries}
            onRemoveSeries={handleRemoveSeries}
            onTogglePlotVisibility={handleTogglePlotVisibility}
            onTogglePlotHighlight={handleTogglePlotHighlight}
            onToggleResetHighlight={debouncedHandleResetHighlight}
          />
        </div>
      </div>

      {/* Figure */}
      {filteredSeries.length > 0 ? (
        <div className="flex flex-col space-y-4 p-2 h-full">
          <div className="flex justify-end">
            <TimePeriodSelector
              periods={periods}
              selected={timePeriod}
              dateRange={dateRange} // Pass dateRange to TimePeriodSelector
              onPeriodSelect={handleSelectPeriod}
              onDateRangeChange={handleDateRangeChange} // Pass handleDateRangeChange to TimePeriodSelector
            />
          </div>
          <PlotLineFigure
            data={filteredSeries.map(series => ({
              ...series.plotData,
              opacity: highlightedSeries[series.id] ?? 1,
              line: { color: series.color },
              visible: hiddenSeries[series.id] ?? true,
            }))}
            theme="dark"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground">
          Select Series to display the plot
        </div>
      )}
    </div>
  )
}
```

**Key Changes:**

*   **`defaultPeriod` Prop:** The `PlotLine` component now accepts an optional `defaultPeriod` prop, which defaults to "All" if not provided.
*   **Initial `timePeriod` State:** The initial state of the `timePeriod` state variable is now set based on the `defaultPeriod` prop.
*   **`handleDateRangeChange`:** When a date range is selected, the `timePeriod` state is now set to the `defaultPeriod`, ensuring that the time period filter is reset to the specified default.

With these changes, you can now customize the default time period for the `PlotLine` component by passing a `defaultPeriod` prop. If no prop is provided, the default will be "All".

**Potential Improvements:**

*   **Validation of `defaultPeriod`:** You could add validation to ensure that the `defaultPeriod` prop is a valid time period label.
*   **More flexible default values:** You could allow the `defaultPeriod` prop to accept a `TimePeriod` object directly, rather than just a label.


